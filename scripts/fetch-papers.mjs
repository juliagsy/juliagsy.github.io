#!/usr/bin/env node

/**
 * Fetches the latest AI/ML papers from Hugging Face Daily Papers and writes
 * `components/papers.json`, which `pages/tools/papers.tsx` imports at build time.
 *
 * `components/papers.json` is GENERATED — do not hand-edit it, the daily
 * `.github/workflows/papers.yml` run will overwrite any manual change.
 *
 * Zero dependencies: uses the built-in `fetch` from Node 20+.
 *
 *   node scripts/fetch-papers.mjs
 */

import { readFile, writeFile } from "node:fs/promises";

const API = "https://huggingface.co/api/daily_papers";
const SOURCE = ["Hugging Face Daily Papers", "https://huggingface.co/papers"];
const OUT = new URL("../components/papers.json", import.meta.url);
const UA = "juliagsy.github.io-papers-bot (+https://github.com/juliagsy/juliagsy.github.io)";

const DAYS_TO_KEEP = 5;    // distinct dates that actually have papers
const LOOKBACK_DAYS = 10;  // calendar days probed — Daily Papers is quiet on Sundays
const MAX_PER_DAY = 10;    // top papers per day, ranked by upvotes
const MAX_AUTHORS = 4;
const MAX_KEYWORDS = 5;
const MAX_SUMMARY = 320;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Collapses the newlines and runs of whitespace that the API returns inside abstracts. */
function clean(text) {
    return String(text ?? "").replace(/\s+/g, " ").trim();
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

function authorLabel(authors) {
    const names = authors.map((author) => clean(author?.name)).filter(Boolean);
    if (names.length === 0) return "Unknown authors";
    if (names.length <= MAX_AUTHORS) return names.join(", ");
    return `${names.slice(0, MAX_AUTHORS).join(", ")} et al.`;
}

function normalise(entry) {
    const paper = entry?.paper ?? {};
    const id = clean(paper.id);
    const title = clean(entry?.title ?? paper.title);
    if (!id || !title) return null;

    return {
        id,
        title,
        authors: authorLabel(paper.authors ?? []),
        summary: truncate(clean(paper.ai_summary || paper.summary || entry?.summary), MAX_SUMMARY),
        keywords: (paper.ai_keywords ?? []).map(clean).filter(Boolean).slice(0, MAX_KEYWORDS),
        upvotes: Number(paper.upvotes) || 0,
        url: `https://arxiv.org/abs/${id}`,
        pdf: `https://arxiv.org/pdf/${id}`,
    };
}

async function fetchDay(iso) {
    const response = await fetch(`${API}?date=${iso}`, { headers: { "user-agent": UA } });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const entries = await response.json();
    if (!Array.isArray(entries)) throw new Error("unexpected payload, expected an array");

    return entries
        .map(normalise)
        .filter(Boolean)
        .sort((a, b) => b.upvotes - a.upvotes || a.title.localeCompare(b.title))
        .slice(0, MAX_PER_DAY);
}

async function readExisting() {
    try {
        return JSON.parse(await readFile(OUT, "utf8"));
    } catch {
        return null;
    }
}

async function main() {
    const days = [];
    const today = new Date();
    let failures = 0;

    for (let offset = 0; offset < LOOKBACK_DAYS && days.length < DAYS_TO_KEEP; offset += 1) {
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - offset);
        const iso = isoDate(date);

        try {
            const papers = await fetchDay(iso);
            if (papers.length > 0) {
                days.push({ date: iso, label: dateLabel(iso), papers });
                console.log(`${iso}: ${papers.length} paper(s)`);
            } else {
                console.log(`${iso}: none published`);
            }
        } catch (error) {
            failures += 1;
            console.warn(`${iso}: skipped (${error.message})`);
        }

        await sleep(250);
    }

    // A total outage must not blank the page — leave the last good snapshot in place.
    if (days.length === 0) {
        console.error(`no papers fetched (${failures} request failure(s)); leaving papers.json untouched`);
        process.exit(1);
    }

    const existing = await readExisting();
    if (existing && JSON.stringify(existing.days) === JSON.stringify(days)) {
        console.log("no change");
        return;
    }

    const payload = {
        updated: dateLabel(isoDate(today)),
        source: SOURCE,
        days,
    };

    await writeFile(OUT, `${JSON.stringify(payload, null, 4)}\n`, "utf8");
    console.log(`wrote ${days.length} day(s), ${days.reduce((n, day) => n + day.papers.length, 0)} paper(s)`);
}

await main();
