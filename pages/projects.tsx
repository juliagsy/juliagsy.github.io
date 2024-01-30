import Head from "next/head";
// import Card from "@/components/card";
import data from "@/components/data.json";

export default function Projects() {
    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Projects</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Projects`}</title>
            </Head>
            <div className="main-gallery">
                {/* <Card title="Test" desc="todo" url="/"></Card>
                <Card title="Test" desc="todo" url="/"></Card>
                <Card title="Test" desc="todo" url="/"></Card> */}
            </div>
        </div>
    )
}