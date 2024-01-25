import Head from "next/head";
import Award from "@/components/card/award";
import data from "@/components/data.json";
import { Key } from "react";

export default function Awards() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Awards</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Awards`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.awards.map((item) => (
                        <Award key={item[0] as Key} item={item} />
                    ))
                }
            </div>
        </div>
    )
}