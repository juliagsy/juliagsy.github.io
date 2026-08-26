import Head from "next/head";
import data from "@/components/data.json";
import Tool from "@/components/card/tool";
import { Key } from "react";

export default function Tools() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Tools</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Tools`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.tools.map((item) => (
                        <Tool key={item[0] as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}
