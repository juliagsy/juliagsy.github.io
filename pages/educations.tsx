import Head from "next/head";
import data from "@/components/data.json";
import Education from "@/components/card/education";

export default function Educations() {
    return (
        <div className="my-[8%]">
            <div className="text-5xl px-[3%] pt-[2%]">Educations</div>
            <Head>
                <title>{`${data.name} - Educations`}</title>
            </Head>
            <div className="grid grid-cols-1 gap-5 px-[10%] py-[3%]">
                {
                    data.educations.map((item) => (
                        <Education key={item[1]} item={item} />
                    ))
                }
            </div>
        </div>
    )
}