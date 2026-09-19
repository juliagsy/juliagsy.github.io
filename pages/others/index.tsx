import Head from "next/head";
import data from "@/components/data.json";
import Tool from "@/components/card/tool";
import { Key } from "react";

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
                        <Tool key={item[0] as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}
