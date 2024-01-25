import Head from "next/head";
import data from "@/components/data.json";
import Education from "@/components/card/education";
import { Key } from "react";

export default function Educations() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Educations</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Educations`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.educations.map((item) => (
                        <Education key={item[1] as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}