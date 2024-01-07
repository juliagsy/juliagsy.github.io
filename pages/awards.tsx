import Head from "next/head";
import Award from "@/components/card/award";
import data from "@/components/data.json";

export default function Awards() {
    return (
        <div className="my-[8%]">
            <div className="text-5xl px-[3%] pt-[2%]">Awards</div>
            <Head>
                <title>{`${data.name} - Awards`}</title>
            </Head>
            <div className="grid grid-cols-1 gap-5 px-[10%] py-[3%]">
                {
                    data.awards.map((item) => (
                        <Award key={item[1]} item={item} />
                    ))
                }
            </div>
        </div>
    )
}