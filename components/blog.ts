/**
 * Reads the markdown posts in `content/blog` and renders them to HTML.
 *
 * BUILD TIME ONLY. This module imports `node:fs`, so it must be reached from
 * `getStaticProps` / `getStaticPaths` and nothing else. Next strips imports that
 * only those functions use out of the client bundle; import it from a component
 * body instead and the build dies on a missing `fs`.
 *
 * Rendering here rather than in the browser is deliberate: the client receives
 * finished HTML, so neither `marked` nor `gray-matter` ships to visitors.
 *
 * A post is `content/blog/<YYYY-MM-DD>-<slug>.md`:
 *
 *     ---
 *     title: Why I scrape arXiv every morning
 *     date: 2026-09-18
 *     tags: [ml, engineering]
 *     summary: One or two lines shown on the blog list and in the page metadata.
 *     ---
 *
 *     Markdown body.
 *
 * Tags must exist in `components/tags.json`, the single source of truth shared
 * with the filter bar and the tools card — the same discipline `topics.json`
 * enforces for papers. Every rule below throws rather than degrades: a typo in a
 * tag or a date should fail the build, not quietly drop a post off a filter.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import tags from "@/components/tags.json";

const DIR = join(process.cwd(), "content", "blog");
const FILE = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/;
const IDS = new Set(tags.map((tag) => tag[0]));
const SEARCH = 5000;  // plain-text characters per post carried to the list page for search

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Matches the "16 September 2026" labels the papers scraper precomputes. Formatting
// at build time keeps the date identical for every visitor, which toLocaleDateString
// in the browser would not.
function label(date: string) {
    const [year, month, day] = date.split("-");
    return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

// gray-matter hands back a Date for an unquoted YAML date, a string for a quoted
// one. Normalise to YYYY-MM-DD, reading the Date in UTC so a build machine west of
// Greenwich cannot shift a post to the previous day.
function date(value: unknown, file: string) {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return value.trim();
    throw new Error(`${file}: 'date' must be YYYY-MM-DD`);
}

// marked emits a bare <table>, which has nowhere to scroll when a table is wider
// than the column. Wrapping each one in a scroller beats the usual `display: block`
// hack on the table itself, which costs proper table layout.
//
// A plain transform of the output, NOT a `marked.use({ hooks })` postprocess:
// `marked` is a shared singleton and `use` appends rather than replaces, so a hook
// registered at module scope stacks up another copy every time this module is
// re-evaluated — which the dev server does on each recompile, nesting one wrapper
// per reload. This stays idempotent because nothing outside the call is touched.
function scroll(html: string) {
    return html
        .replace(/<table>/g, '<div class="post-table"><table>')
        .replace(/<\/table>/g, "</table></div>");
}

function read(file: string) {
    const name = FILE.exec(file);
    if (!name) throw new Error(`${file}: name a post <YYYY-MM-DD>-<slug>.md, slug in a-z 0-9 and dashes`);

    const { data, content } = matter(readFileSync(join(DIR, file), "utf8"));

    if (typeof data.title !== "string" || data.title.trim() === "") throw new Error(`${file}: missing 'title'`);
    if (typeof data.summary !== "string" || data.summary.trim() === "") throw new Error(`${file}: missing 'summary'`);

    // The prefix exists so the directory sorts chronologically; disagreeing with the
    // frontmatter would make one of the two a lie.
    const day = date(data.date, file);
    if (day !== name[1]) throw new Error(`${file}: filename says ${name[1]}, frontmatter says ${day}`);

    const list = data.tags ?? [];
    if (!Array.isArray(list)) throw new Error(`${file}: 'tags' must be a list`);
    for (const tag of list) {
        if (!IDS.has(tag)) throw new Error(`${file}: unknown tag '${tag}' — add it to components/tags.json`);
        if (tag === "all") throw new Error(`${file}: 'all' is the filter bar's catch-all, not a tag`);
    }

    const html = scroll(marked.parse(content, { async: false }));

    return {
        meta: {
            slug: name[2],
            date: day,
            label: label(day),
            title: data.title.trim(),
            summary: data.summary.trim(),
            tags: list as string[],
        },
        html,
        // Plain text purely so the list page can search post bodies. It travels in the
        // list page's props, so it is capped — without a cap every word of every post
        // would ride along with the list.
        text: html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, SEARCH),
    };
}

function all() {
    const posts = readdirSync(DIR).filter((file) => file.endsWith(".md")).map(read);

    const seen = new Set<string>();
    for (const post of posts) {
        if (seen.has(post.meta.slug)) throw new Error(`duplicate post slug '${post.meta.slug}'`);
        seen.add(post.meta.slug);
    }

    return posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

/** Every post, newest first, without its rendered body. */
export function listPosts() {
    return all().map((post) => ({ ...post.meta, text: post.text }));
}

/** One post, rendered. Throws for an unknown slug, which getStaticPaths prevents. */
export function readPost(slug: string) {
    const post = all().find((item) => item.meta.slug === slug);
    if (!post) throw new Error(`no post with slug '${slug}'`);
    return { meta: post.meta, html: post.html };
}
