import Head from "next/head";
import data from "@/components/data.json";
import Experience from "@/components/card/experience";
import { Key } from "react";

export default function Experiences() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left mr-[15%] md:mr-[0%]"></div>
                <div className="main-title">Experiences</div>
                <div className="main-partition-right ml-[15%] md:ml-[0%]"></div>
            </div>
            <Head>
                <title>{`${data.name} - Experiences`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.experiences.map((item) => (
                        <Experience key={item[0] as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}