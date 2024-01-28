import Head from "next/head";
import data from "@/components/data.json";
import Experience from "@/components/card/experience";

export default function Experiences() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Experiences</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Experiences`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.experiences.map((item) => (
                        <Experience key={item[0]} item={item} />
                    ))
                }
            </div>
        </div>
    )
}