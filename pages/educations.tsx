import Head from "next/head";
import data from "@/components/data.json";
import Education from "@/components/card/education";

export default function Educations() {
    return (
        <div className="content">
            <div className="main-title">Educations</div>
            <Head>
                <title>{`${data.name} - Educations`}</title>
            </Head>
            <div className="main-gallery">
                {
                    data.educations.map((item) => (
                        <Education key={item[1]} item={item} />
                    ))
                }
            </div>
        </div>
    )
}