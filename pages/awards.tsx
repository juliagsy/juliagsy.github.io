import Head from "next/head";
import Award from "@/components/card/award";
import data from "@/components/data.json";

export default function Awards() {
    return (
        <div className="content">
            <div className="main-title">Awards</div>
            <Head>
                <title>{`${data.name} - Awards`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.awards.map((item) => (
                        <Award key={item[0]} item={item} />
                    ))
                }
            </div>
        </div>
    )
}