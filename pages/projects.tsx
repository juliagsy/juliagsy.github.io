import Head from "next/head";
import data from "@/components/data.json";
import Project from "@/components/card/project";
import { Key } from "react";

export default function Projects() {
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
            <div className="main-gallery">
                {
                    data.projects.map((item) => (
                        <Project key={item[0] as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}