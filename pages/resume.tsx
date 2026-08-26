import Head from "next/head";
import data from "@/components/data.json";
import { Key } from "react";

const research = data.projects.filter((item) => item[6] === "research");

// "September 2020 - June 2024" -> "September '20 – June '24", as the PDF has it.
const shortDate = (text) => String(text)
    .replace(/\b\d{2}(\d{2})\b/g, "'$1")
    .replace(/\s+-\s+/g, " – ");

function Bullets({ items, boldLast = false }) {
    const last = items.length - 1;
    return (
        <ul className="resume-list">
            {
                items.map((desc, index) => (
                    <li key={index} className={boldLast && index === last ? "font-bold" : undefined}>
                        {
                            Array.isArray(desc)
                            ? <><a href={desc[0]} target="_blank">{desc[1]}</a>: {desc[2]}</>
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

function Head3({ org, title, date }) {
    return <><span className="font-bold">{org}</span> | {title} | {shortDate(date)}</>
}

// Kept as its own component so `item` arrives untyped: narrowing Array.isArray()
// on an element access of the imported JSON does not propagate in TypeScript.
function EducationEntry({ item }) {
    const grade = item[3];
    return (
        <Entry
            head={<Head3 org={item[2]} title={item[1]} date={item[0]} />}
            items={[
                <><span className="font-bold">Grade</span>: {
                    Array.isArray(grade) ? <a href={grade[1]} target="_blank">{grade[0]}</a> : grade
                }</>,
                ...item[4],
            ]}
        />
    )
}

export default function Resume() {
    return (
        <div>
            <Head>
                <title>{`${data.name} - Resume`}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Century+Gothic:ital,wght@0,400;0,700;1,400&display=swap"
                />
            </Head>

            <div className="print:hidden text-center pb-[2%]">
                <button type="button" className="filter-item" onClick={() => window.print()}>
                    Save as PDF
                </button>
            </div>

            {/* an A4 sheet is wider than a phone; scroll the sheet, not the page */}
            <div className="overflow-x-auto print:overflow-visible">
            <div className="resume">
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
                            {" | Referrals: "}
                            {
                                data.referrals.map((item, index) => (
                                    <span key={item[0] as Key}>{index > 0 ? ", " : ""}<a href={item[1]} target="_blank">{item[0]}</a></span>
                                ))
                            }
                        </p>
                        <p className="resume-meta pt-[1.5mm]">{data.about}</p>
                    </div>
                </div>

                <p className="resume-section">Education</p>
                {
                    data.educations.map((item) => (
                        <EducationEntry key={item[1] as Key} item={item} />
                    ))
                }

                <p className="resume-section">Experiences</p>
                {
                    data.experiences.map((item) => (
                        <Entry
                            key={item[0] as Key}
                            head={<Head3 org={item[2]} title={item[1]} date={item[0]} />}
                            items={item[4]}
                            boldLast
                        />
                    ))
                }

                <p className="resume-section">Research</p>
                {
                    research.map((item) => (
                        <Entry
                            key={item[0] as Key}
                            head={<Head3 org={item[2]} title={item[0]} date={item[1]} />}
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
