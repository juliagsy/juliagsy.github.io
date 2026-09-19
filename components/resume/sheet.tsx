import Head from "next/head";
import { Key } from "react";

// The resume is a summary, not the whole site — keep only the most recent of each.
// data.json is ordered newest-first, so a slice is enough.
const EDUCATIONS = 1;
const EXPERIENCES = 3;
const RESEARCH = 3;

// A label that ends in a Chinese character takes a full-width colon, an English one
// the ASCII pair — which is how the 2024 CV set it ("Model Hub: 全栈", "管道外部腐蚀：…").
// Language-agnostic on purpose: labels are mixed within the Chinese sheet itself.
const labelColon = (label) => (/[\u4e00-\u9fff]$/.test(String(label)) ? "：" : ": ");

function Bullets({ items, boldLast = false }) {
    const last = items.length - 1;
    return (
        <ul className="resume-list">
            {
                items.map((desc, index) => (
                    <li key={index} className={boldLast && index === last ? "font-bold" : undefined}>
                        {
                            // data.json carries two link shapes: education bullets are
                            // [text, url] (what components/card/education.tsx reads), while
                            // experience and project bullets are [url, label, description].
                            // Handling only the latter turned the education bullet into a
                            // link whose href was the sentence and whose text was the URL.
                            Array.isArray(desc)
                            ? (
                                desc.length === 2
                                ? <a href={desc[1]} target="_blank">{desc[0]}</a>
                                : <><a href={desc[0]} target="_blank">{desc[1]}</a>{labelColon(desc[1])}{desc[2]}</>
                            )
                            : desc
                        }
                    </li>
                ))
            }
        </ul>
    )
}

function Entry({ head, items, boldLast = false }) {
    return (
        <div className="resume-entry">
            <p className="resume-entry-head">{head}</p>
            <Bullets items={items} boldLast={boldLast} />
        </div>
    )
}

// Dates sit on a continuation line of their own, keeping the leading pipe — the
// same shape the PDF header uses for its second line of links.
function Head3({ org, title, date, lang }) {
    return (
        <>
            <span className="font-bold">{org}</span> | {title}
            <br />| {lang.date(date)}
        </>
    )
}

// Kept as its own component so `item` arrives untyped: narrowing Array.isArray()
// on an element access of the imported JSON does not propagate in TypeScript.
function EducationEntry({ item, lang }) {
    const grade = item[3];
    return (
        <Entry
            head={<Head3 org={item[2]} title={item[1]} date={item[0]} lang={lang} />}
            items={[
                <><span className="font-bold">{lang.grade}</span>{lang.colon}{
                    Array.isArray(grade) ? <a href={grade[1]} target="_blank">{grade[0]}</a> : grade
                }</>,
                ...item[4],
            ]}
        />
    )
}

/**
 * The A4 print sheet, shared by /resume and /resume/zh.
 *
 * `data` is data.json or its mirror data.zh.json — the two hold the same tuples at
 * the same indices, so everything below reads either one unchanged. Dates are the
 * one exception: both files store the ENGLISH date string ("April 2025 - Present")
 * and `lang.date` renders it, so the translation never has to restate a date and
 * scripts/check-zh.mjs can compare the two files field for field.
 */
export default function ResumeSheet({ data, lang }) {
    const educations = data.educations.slice(0, EDUCATIONS);
    const experiences = data.experiences.slice(0, EXPERIENCES);
    const research = data.projects.filter((item) => item[6] === "research").slice(0, RESEARCH);

    return (
        <div>
            <Head>
                <title>{lang.title(data.name)}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Both hrefs are spelled out as literals on purpose. Next gathers
                    Google Fonts stylesheets by statically reading the source, so a
                    .map() or even an href={CONSTANT} is invisible to it and the font
                    CSS silently degrades from inlined to a render-blocking request.

                    Century Gothic is not a normal Google Font, but Google serves it
                    from their licensed /l/font endpoint, which this request resolves
                    to. It carries no CJK glyphs at all, so the Chinese sheet adds
                    Noto Sans SC behind it and the browser falls through per glyph —
                    Latin in Century Gothic, Chinese in Noto Sans SC, the mix the 2024
                    CV PDF had (it used Hiragino Sans GB, a macOS font with no web
                    equivalent). */}
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Century+Gothic:ital,wght@0,400;0,700;1,400&display=swap" />
                {
                    lang.cjk
                    ? <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap" />
                    : null
                }
            </Head>

            <div className="print:hidden text-center pb-[2%]">
                <button type="button" className="filter-item" onClick={() => window.print()}>
                    {lang.print}
                </button>
            </div>

            {/* an A4 sheet is wider than a phone; scroll the sheet, not the page */}
            <div className="overflow-x-auto print:overflow-visible">
            <div className={lang.sheetClass} lang={lang.htmlLang}>
                <div className="flex flex-row gap-4">
                    <img className="h-[26mm] w-[26mm] rounded-lg object-cover" src="/static/photo.jpeg" alt={data.name} />
                    <div>
                        <p className="resume-name">{data.name}</p>
                        <p className="resume-meta">
                            {
                                data.contacts.map((item) => (
                                    <span key={item[0] as Key}> | <a href={item[2]} target="_blank">{item[0]}</a></span>
                                ))
                            }
                            {` | ${lang.referrals}`}
                            {
                                data.referrals.map((item, index) => (
                                    <span key={item[0] as Key}>{index > 0 ? ", " : ""}<a href={item[1]} target="_blank">{item[0]}</a></span>
                                ))
                            }
                        </p>
                        <p className="resume-meta pt-[1.5mm]">{data.about}</p>
                    </div>
                </div>

                <p className="resume-section">{lang.sections.education}</p>
                {
                    educations.map((item) => (
                        <EducationEntry key={item[1] as Key} item={item} lang={lang} />
                    ))
                }

                <p className="resume-section">{lang.sections.experiences}</p>
                {
                    experiences.map((item) => (
                        <Entry
                            key={item[0] as Key}
                            head={<Head3 org={item[2]} title={item[1]} date={item[0]} lang={lang} />}
                            items={item[4]}
                            boldLast
                        />
                    ))
                }

                <p className="resume-section">{lang.sections.research}</p>
                {
                    research.map((item) => (
                        <Entry
                            key={item[0] as Key}
                            head={<Head3 org={item[2]} title={item[0]} date={item[1]} lang={lang} />}
                            items={item[5]}
                            boldLast
                        />
                    ))
                }
            </div>
            </div>
        </div>
    )
}
