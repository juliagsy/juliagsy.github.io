import Head from "next/head";
import data from "@/components/data.json";
import Project from "@/components/card/project";
import useTab from "@/components/tab";
import { Key } from "react";

const SECTIONS = [
    ["all", "All"],
    ["research", "Research"],
    ["coursework", "Coursework"],
];

export default function Projects() {
    // Deep links (/projects#research) open on that section.
    const [section, selectSection] = useTab(SECTIONS.map((item) => item[0]));
    const shows = (id) => section === "all" || section === id;

    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Projects</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Projects`}</title>
            </Head>

            <div className="filter-bar">
                {
                    SECTIONS.map((item) => (
                        <button
                            key={item[0] as Key}
                            type="button"
                            className={`filter-item${item[0] === section ? " filter-item-active" : ""}`}
                            onClick={() => selectSection(item[0])}
                        >
                            {item[1]}
                        </button>
                    ))
                }
            </div>

            <div className="main-gallery">
                {
                    SECTIONS.slice(1).map((group) => (
                        !shows(group[0]) ? null :
                        <div key={group[0] as Key}>
                            <div className="component-title">{group[1]}</div>
                            <div className="component-gallery">
                                {
                                    data.projects.filter((item) => item[6] === group[0]).map((item) => (
                                        <Project key={item[0] as Key} item={item} />
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
