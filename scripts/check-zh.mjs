/**
 * Guards components/data.zh.json against drifting away from components/data.json.
 *
 * data.zh.json is a hand-maintained mirror: same tuples, same indices, translated
 * text. Nothing in the build notices when a job is added to data.json and not to
 * its mirror — /resume/zh would just keep rendering the previous top three. This
 * compares the slices both sheets actually render and fails loudly instead.
 *
 * Dates are the anchor: both files store the ENGLISH date string, so they must
 * match exactly. Run with `node scripts/check-zh.mjs`.
 */
import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

const en = read("components/data.json");
const zh = read("components/data.zh.json");

// Keep in step with the slice sizes in components/resume/sheet.tsx.
const EDUCATIONS = 1;
const EXPERIENCES = 3;
const RESEARCH = 3;

const research = (data) => data.projects.filter((item) => item[6] === "research");

const problems = [];

const compare = (label, enRows, zhRows, dateAt, nameAt) => {
    if (enRows.length !== zhRows.length) {
        problems.push(`${label}: data.json renders ${enRows.length}, data.zh.json has ${zhRows.length}`);
        return;
    }
    enRows.forEach((row, index) => {
        const mine = row[dateAt];
        const theirs = zhRows[index]?.[dateAt];
        if (mine !== theirs) {
            problems.push(
                `${label}[${index}] (${row[nameAt]}): date is "${mine}" in data.json `
                + `but "${theirs}" in data.zh.json — the mirror is out of date`
            );
        }
    });
};

compare("educations", en.educations.slice(0, EDUCATIONS), zh.educations.slice(0, EDUCATIONS), 0, 2);
compare("experiences", en.experiences.slice(0, EXPERIENCES), zh.experiences.slice(0, EXPERIENCES), 0, 2);
compare("research", research(en).slice(0, RESEARCH), research(zh).slice(0, RESEARCH), 1, 2);

// A bullet count that no longer lines up means a bullet was added or dropped on
// one side only; the sheets would then differ in substance, not just wording.
const bullets = (label, enRows, zhRows, at) => {
    enRows.forEach((row, index) => {
        const theirs = zhRows[index]?.[at];
        if (!theirs || theirs.length !== row[at].length) {
            problems.push(
                `${label}[${index}]: ${row[at].length} bullets in data.json, `
                + `${theirs ? theirs.length : "none"} in data.zh.json`
            );
        }
    });
};

bullets("educations", en.educations.slice(0, EDUCATIONS), zh.educations.slice(0, EDUCATIONS), 4);
bullets("experiences", en.experiences.slice(0, EXPERIENCES), zh.experiences.slice(0, EXPERIENCES), 4);
bullets("research", research(en).slice(0, RESEARCH), research(zh).slice(0, RESEARCH), 5);

if (problems.length) {
    console.error("components/data.zh.json is out of sync with components/data.json:\n");
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error("\nUpdate the mirror so /resume and /resume/zh show the same entries.");
    process.exit(1);
}

console.log("data.zh.json mirrors data.json for every entry /resume/zh renders.");
