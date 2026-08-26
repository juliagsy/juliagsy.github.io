import Head from "next/head";
import data from "@/components/data.json";
import papers from "@/components/papers.json";
import topics from "@/components/topics.json";
import Paper from "@/components/card/paper";
import { Key, useState } from "react";

const total = papers.days.reduce((count, day) => count + day.papers.length, 0);

export default function Papers() {
    const [topic, setTopic] = useState("all");
    const [query, setQuery] = useState("");

    const search = query.trim().toLowerCase();
    const match = (paper) => (
        (topic === "all" || paper.topics.includes(topic))
        && (search === "" || `${paper.title} ${paper.authors} ${paper.summary} ${paper.cats.join(" ")}`.toLowerCase().includes(search))
    );

    const days = papers.days
        .map((day) => ({ ...day, papers: day.papers.filter(match) }))
        .filter((day) => day.papers.length > 0);
    const shown = days.reduce((count, day) => count + day.papers.length, 0);

    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left mr-[7%] md:mr-[0%]"></div>
                <div className="main-title">Latest Papers</div>
                <div className="main-partition-right ml-[7%] md:ml-[0%]"></div>
            </div>
            <Head>
                <title>{`${data.name} - Latest Papers`}</title>
            </Head>
            <p className="text-center py-[2%]">
                Daily pick of latest papers for the past {papers.days.length} days. Updated {papers.updated}.
            </p>

            <div className="filter-bar">
                {
                    topics.map((item) => (
                        <button
                            key={item[0] as Key}
                            type="button"
                            className={`filter-item${item[0] === topic ? " filter-item-active" : ""}`}
                            onClick={() => setTopic(item[0] as string)}
                        >
                            {item[1]}
                        </button>
                    ))
                }
            </div>

            <input
                className="search-box"
                type="search"
                value={query}
                aria-label="Search papers"
                placeholder="Search title, authors, abstract or category"
                onChange={(event) => setQuery(event.target.value)}
            />

            <p className="text-center py-[1%]">{shown} of {total} papers</p>

            {
                shown === 0
                ? <p className="text-center py-[3%]">No papers match this filter.</p>
                : <div className="main-gallery">
                    {
                        days.map((item) => (
                            <Paper key={item.date as Key} item={item} />
                        ))
                    }
                  </div>
            }
        </div>
    )
}
