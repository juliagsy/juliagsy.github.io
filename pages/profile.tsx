import Head from "next/head";
import data from "@/components/data.json";
import Education from "@/components/card/education";
import Experience from "@/components/card/experience";
import useTab from "@/components/tab";
import { Key } from "react";

const SECTIONS = [
    ["all", "All"],
    ["educations", "Educations"],
    ["experiences", "Experiences"],
];

export default function ProfilePage() {
    // Deep links (/profile#experiences) open on that section.
    const [section, selectSection] = useTab(SECTIONS.map((item) => item[0]));
    const shows = (id) => section === "all" || section === id;

    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Profile</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Profile`}</title>
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
                    !shows("educations") ? null :
                    <div>
                        <div className="component-title">Educations</div>
                        <div className="component-gallery">
                            {
                                data.educations.map((item) => (
                                    <Education key={item[1] as Key} item={item} />
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    !shows("experiences") ? null :
                    <div>
                        <div className="component-title">Experiences</div>
                        <div className="component-gallery">
                            {
                                data.experiences.map((item) => (
                                    <Experience key={item[0] as Key} item={item} />
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
