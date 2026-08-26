#!/usr/bin/env node

/**
 * Fetches the latest papers from the arXiv API and writes `components/papers.json`,
 * which `pages/tools/papers.tsx` imports at build time.
 *
 * `components/papers.json` is GENERATED — do not hand-edit it, the daily
 * `.github/workflows/papers.yml` run will overwrite any manual change.
 *
 * Topic groups live in `components/topics.json`, the single source of truth shared
 * with the papers page (filter chips) and the tools page (card preview).
 *
 * Zero dependencies: built-in `fetch` from Node 20+, and arXiv's Atom feed is
 * regular enough to parse without an XML library.
 *
 *   node scripts/fetch-papers.mjs
 */

import { readFile, writeFile } from "node:fs/promises";

const API = "https://export.arxiv.org/api/query";
const SOURCE = ["arXiv", "https://arxiv.org"];
const OUT = new URL("../components/papers.json", import.meta.url);
const TOPICS = new URL("../components/topics.json", import.meta.url);
const UA = "juliagsy.github.io-papers-bot (+https://github.com/juliagsy/juliagsy.github.io)";

const DAYS_TO_KEEP = 5;    // distinct dates that actually have papers
const LOOKBACK_DAYS = 10;  // calendar days probed before giving up
const MAX_PER_DAY = 6;     // papers kept per topic per day
const MAX_FETCH = 60;      // candidates pulled per topic per day before selection
const MAX_AUTHORS = 4;
const MAX_CATS = 6;
const MAX_SUMMARY = 240;
const REQUEST_GAP = 3000;  // arXiv asks for one request per 3 seconds
const MAX_FAILURE_RATE = 0.25;
const REQUEST_TIMEOUT = 30000; // a hung connection must not stall the daily workflow
const REQUEST_TRIES = 3;

// Keyword matching for "Graphics & Games" drags in game-theory and economics
// papers ("mean field game", "Nash equilibrium"). Drop those unless the paper is
// genuinely categorised under graphics. Tune this if noise gets through.
const NOISE = {
    graphics: /mean[- ]field game|game[- ]theor|nash equilibri|coalition|auction|stackelberg|congestion game|social ranking/i,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function decode(text) {
    return String(text)
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&amp;/g, "&");
}

// arXiv titles and abstracts are LaTeX source, so they arrive with math delimiters,
// formatting commands and accent escapes in them. Render what we can as plain
// Unicode and strip the rest, rather than showing raw markup on the page.
const SYMBOL = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε",
    zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ",
    lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ",
    sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", chi: "χ",
    psi: "ψ", omega: "ω", Gamma: "Γ", Delta: "Δ", Theta: "Θ",
    Lambda: "Λ", Xi: "Ξ", Pi: "Π", Sigma: "Σ", Phi: "Φ",
    Psi: "Ψ", Omega: "Ω", times: "×", cdot: "·", pm: "±",
    leq: "≤", geq: "≥", neq: "≠", approx: "≈", equiv: "≡",
    infty: "∞", rightarrow: "→", leftarrow: "←", to: "→",
    ldots: "…", dots: "…", circ: "°", ell: "ℓ", partial: "∂",
    nabla: "∇", propto: "∝", in: "∈", subset: "⊂", cup: "∪",
    cap: "∩", forall: "∀", exists: "∃", sqrt: "√", sum: "∑",
    prod: "∏", int: "∫", angle: "∠", perp: "⊥",
};
const SUP = { 0:"⁰", 1:"¹", 2:"²", 3:"³", 4:"⁴", 5:"⁵",
    6:"⁶", 7:"⁷", 8:"⁸", 9:"⁹", "+":"⁺", "-":"⁻",
    n:"ⁿ", i:"ⁱ" };
const SUB = { 0:"₀", 1:"₁", 2:"₂", 3:"₃", 4:"₄", 5:"₅",
    6:"₆", 7:"₇", 8:"₈", 9:"₉", "+":"₊", "-":"₋" };
const ACCENT = { "'": "́", "`": "̀", '"': "̈", "^": "̂", "~": "̃",
    "=": "̄", ".": "̇", u: "̆", v: "̌", H: "̋", c: "̧",
    k: "̨", d: "̣", b: "̱", r: "̊" };
const LETTER = { ss: "ß", aa: "å", AA: "Å", o: "ø", O: "Ø",
    ae: "æ", AE: "Æ", oe: "œ", OE: "Œ", l: "ł", L: "Ł" };

/** Renders sub/superscript content in Unicode, or falls back to the bare text. */
function script(content, map) {
    const text = content.trim();
    const chars = [...text];
    return chars.length > 0 && chars.every((c) => c in map)
        ? chars.map((c) => map[c]).join("")
        : text;
}

function delatex(text) {
    let out = String(text);
    out = out.replace(/\\\\/g, " ");

    // Dotless i/j only ever appear as accent bases: \'{\i} -> i + acute -> i-acute
    out = out.replace(/\\([ij])\b/g, "$1");

    // \'e, \'{e}, \c{c} ... -> base letter plus a combining mark, folded by NFC below
    out = out.replace(/\\(['`"^~=.])\s*\{?([a-zA-Z])\}?/g, (whole, mark, letter) => letter + ACCENT[mark]);
    out = out.replace(/\\([uvHckdbr])\{([a-zA-Z])\}/g, (whole, mark, letter) => letter + ACCENT[mark]);
    out = out.replace(/\\(ss|aa|AA|ae|AE|oe|OE|[oOlL])(?![a-zA-Z])/g, (whole, name) => LETTER[name] ?? whole);

    // Sizing and font switches carry nothing in plain text
    out = out.replace(/\\(?:scriptscriptstyle|scriptstyle|displaystyle|textstyle|mathrm|rm|bf|it|sf|tt|left|right|big|Big)\b/g, "");

    // \textbf{x}, \underline{x}, \mathcal{X} ... -> x, repeated for nesting
    for (let depth = 0; depth < 4; depth += 1) {
        out = out.replace(/\\[a-zA-Z]+\s*\{([^{}]*)\}/g, "$1");
    }

    out = out.replace(/\\([a-zA-Z]+)/g, (whole, name) => SYMBOL[name] ?? whole);
    out = out.replace(/\^\{([^{}]*)\}|\^(\S)/g, (whole, braced, single) => script(braced ?? single, SUP));
    out = out.replace(/_\{([^{}]*)\}|_(\S)/g, (whole, braced, single) => script(braced ?? single, SUB));
    out = out.replace(/\\([%&_#${}])/g, "$1");

    // Spacing controls: "et al.\ is" forces an interword space; \! and \- are invisible
    out = out.replace(/\\[ ,;:]/g, " ");
    out = out.replace(/\\[!\-]/g, "");

    out = out.replace(/\\[a-zA-Z]+/g, "");
    out = out.replace(/[${}]/g, "");
    out = out.replace(/---/g, "—").replace(/--/g, "–").replace(/~/g, " ");

    return out;
}

/** Collapses the newlines arXiv wraps at, then renders LaTeX source as plain text. */
function clean(text) {
    return delatex(decode(String(text ?? "").replace(/\s+/g, " ")))
        .replace(/\s+/g, " ")
        .trim()
        .normalize("NFC");
}

/** Truncates on a word boundary so cards stay an even height. */
function truncate(text, max) {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const boundary = cut.lastIndexOf(" ");
    return `${cut.slice(0, boundary > 0 ? boundary : max).replace(/[,;:.]$/, "")}...`;
}

function isoDate(date) {
    return date.toISOString().slice(0, 10);
}

function dateLabel(iso) {
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}

function tagOf(entry, name) {
    const match = entry.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
    return match ? clean(match[1]) : "";
}

function parseEntry(entry) {
    const rawId = tagOf(entry, "id").split("/abs/")[1] ?? "";
    const id = rawId.replace(/v\d+$/, "");
    const title = tagOf(entry, "title");
    if (!id || !title) return null;

    const authors = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => clean(m[1]));
    const cats = [...entry.matchAll(/<category term="([^"]+)"/g)].map((m) => m[1]);
    const primary = entry.match(/<arxiv:primary_category[^>]*term="([^"]+)"/)?.[1] ?? cats[0] ?? "";

    return {
        id,
        title,
        authors: authors.length > MAX_AUTHORS
            ? `${authors.slice(0, MAX_AUTHORS).join(", ")} et al.`
            : authors.join(", ") || "Unknown authors",
        summary: truncate(tagOf(entry, "summary"), MAX_SUMMARY),
        cats: cats.slice(0, MAX_CATS),
        allCats: cats,
        primary,
        published: tagOf(entry, "published"),
        url: `https://arxiv.org/abs/${id}`,
        pdf: `https://arxiv.org/pdf/${id}`,
    };
}

function buildUrl(topic, iso) {
    const [, , cats, terms = []] = topic;
    const clauses = [...cats.map((c) => `cat:${c}`), ...terms.map((t) => `abs:"${t}"`)];
    const stamp = iso.replace(/-/g, "");
    const search = `(${clauses.join(" OR ")}) AND submittedDate:[${stamp}0000 TO ${stamp}2359]`;
    return `${API}?search_query=${encodeURIComponent(search)}`
        + `&sortBy=submittedDate&sortOrder=descending&max_results=${MAX_FETCH}`;
}

/** Fetches with a hard timeout and a couple of retries — arXiv occasionally stalls. */
async function requestXml(url) {
    for (let attempt = 1; ; attempt += 1) {
        try {
            const response = await fetch(url, {
                headers: { "user-agent": UA },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
            return await response.text();
        } catch (error) {
            if (attempt >= REQUEST_TRIES) throw error;
            await sleep(REQUEST_GAP * attempt);
        }
    }
}

async function fetchTopicDay(topic, iso) {
    const xml = await requestXml(buildUrl(topic, iso));
    const papers = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
        .map((m) => parseEntry(m[1]))
        .filter(Boolean);

    const [id, , cats] = topic;
    const inGroup = new Set(cats);
    const noise = NOISE[id];

    const kept = papers.filter((paper) => {
        // Only keyword-matched papers can be noise — a real category match is trusted.
        if (!noise || paper.allCats.some((c) => inGroup.has(c))) return true;
        return !noise.test(`${paper.title} ${paper.summary}`);
    });

    // Papers whose PRIMARY category is in the group come first, so a drive-by
    // cross-list never displaces genuinely on-topic work. Sort is stable, so
    // submittedDate-descending order survives within each bucket.
    return kept
        .sort((a, b) => Number(!inGroup.has(a.primary)) - Number(!inGroup.has(b.primary)))
        .slice(0, MAX_PER_DAY);
}

async function collectDay(topics, iso) {
    const byId = new Map();
    let failures = 0;

    for (const topic of topics) {
        try {
            for (const paper of await fetchTopicDay(topic, iso)) {
                const seen = byId.get(paper.id);
                if (seen) seen.topics.push(topic[0]);
                else byId.set(paper.id, { ...paper, topics: [topic[0]] });
            }
        } catch (error) {
            failures += 1;
            console.warn(`  ${iso} ${topic[0]}: skipped (${error.message})`);
        }
        await sleep(REQUEST_GAP);
    }

    // Topic membership comes from the paper's own categories, not from whichever
    // query happened to select it — otherwise a card tagged cs.CV would be missing
    // from the AI & ML filter. The selecting topic is kept too, so keyword-only
    // matches (a gaming paper filed under cs.CV alone) still land in their group.
    const papers = [...byId.values()]
        .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title))
        .map(({ allCats, primary, published, ...paper }) => {
            const byCategory = topics
                .filter((topic) => allCats.some((cat) => topic[2].includes(cat)))
                .map((topic) => topic[0]);
            const members = new Set([...paper.topics, ...byCategory]);
            return { ...paper, topics: topics.map((t) => t[0]).filter((id) => members.has(id)) };
        });

    return { papers, failures };
}

async function readExisting() {
    try {
        return JSON.parse(await readFile(OUT, "utf8"));
    } catch {
        return null;
    }
}

async function main() {
    const all = JSON.parse(await readFile(TOPICS, "utf8"));
    const topics = all.filter((topic) => topic[2].length > 0 || (topic[3] ?? []).length > 0);
    console.log(`querying ${topics.length} topics: ${topics.map((t) => t[1]).join(", ")}`);

    const days = [];
    const today = new Date();
    let failures = 0;
    let requests = 0;

    for (let offset = 0; offset < LOOKBACK_DAYS && days.length < DAYS_TO_KEEP; offset += 1) {
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - offset);
        const iso = isoDate(date);

        const { papers, failures: dayFailures } = await collectDay(topics, iso);
        failures += dayFailures;
        requests += topics.length;

        if (papers.length > 0) {
            days.push({ date: iso, label: dateLabel(iso), papers });
            console.log(`${iso}: ${papers.length} paper(s)`);
        } else {
            console.log(`${iso}: none published`);
        }
    }

    // An outage must not blank the page, and a flaky run must not silently commit a
    // snapshot with whole topics missing — leave the last good one in place instead.
    if (days.length === 0) {
        console.error(`no papers fetched (${failures} request failure(s)); leaving papers.json untouched`);
        process.exit(1);
    }
    if (failures / requests > MAX_FAILURE_RATE) {
        console.error(`${failures} of ${requests} requests failed; too degraded to publish, leaving papers.json untouched`);
        process.exit(1);
    }

    const existing = await readExisting();
    if (existing && JSON.stringify(existing.days) === JSON.stringify(days)) {
        console.log("no change");
        return;
    }

    const payload = { updated: dateLabel(isoDate(today)), source: SOURCE, days };
    await writeFile(OUT, `${JSON.stringify(payload, null, 4)}\n`, "utf8");
    console.log(`wrote ${days.length} day(s), ${days.reduce((n, d) => n + d.papers.length, 0)} paper(s)`);
}

await main();
