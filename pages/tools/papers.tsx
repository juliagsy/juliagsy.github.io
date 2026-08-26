import Head from "next/head";
import data from "@/components/data.json";
import papers from "@/components/papers.json";
import Paper from "@/components/card/paper";
import { Key } from "react";

export default function Papers() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left mr-[7%] md:mr-[0%]"></div>
                <div className="main-title">Latest Papers</div>
                <div className="main-partition-right ml-[7%] md:ml-[0%]"></div>
            </div>
            <Head>
                <title>{`${data.name} - Latest Papers`}</title>
            </Head>
            <p className="text-center py-[2%]">
                Daily pick of latest papers for the past {papers.days.length} days. Updated {papers.updated}.
            </p>
            <div className="main-gallery">
                {
                    papers.days.map((item) => (
                        <Paper key={item.date as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}
