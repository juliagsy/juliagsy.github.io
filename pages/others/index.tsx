import Head from "next/head";
import data from "@/components/data.json";
import topics from "@/components/topics.json";
import tags from "@/components/tags.json";
import Tool from "@/components/card/tool";
import { Key } from "react";

// Entries that preview a set of labels on their card instead of a description.
const chips: Record<string, string[][]> = {
    "/others/papers": topics.map((item) => [item[0] as string, item[1] as string]),
    "/others/blog": tags,
};

export default function Others() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Others</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Others`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.tools.map((item) => (
                        <Tool key={item[0] as Key} item={item} chips={chips[item[1]]} />
                    ))
                }
            </div>
        </div>
    )
}
