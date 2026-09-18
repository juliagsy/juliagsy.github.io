import Head from "next/head";
import data from "@/components/data.json";
import tags from "@/components/tags.json";
import Post from "@/components/card/post";
import useTab from "@/components/tab";
import { listPosts } from "@/components/blog";
import { Key, useState } from "react";

// Reached only from getStaticProps, so `components/blog` and its `node:fs` import
// stay out of the client bundle.
export async function getStaticProps() {
    return { props: { posts: listPosts() } };
}

export default function Blog({ posts }) {
    // Deep links from the tools card and from a post's tags (/tools/blog#ml) open
    // on that filter.
    const [tag, selectTag] = useTab(tags.map((item) => item[0]));
    const [query, setQuery] = useState("");

    const search = query.trim().toLowerCase();
    const match = (post) => (
        (tag === "all" || post.tags.includes(tag))
        && (search === "" || `${post.title} ${post.summary} ${post.tags.join(" ")} ${post.text}`.toLowerCase().includes(search))
    );

    const shown = posts.filter(match);

    return (
        <div className="content">
            <div className="grid grid-cols-3">
                <div className="main-partition-left"></div>
                <div className="main-title">Blog</div>
                <div className="main-partition-right"></div>
            </div>
            <Head>
                <title>{`${data.name} - Blog`}</title>
            </Head>
            <p className="text-center py-[2%]">
                Notes on machine learning, engineering and whatever else held my attention.
            </p>

            <div className="filter-bar">
                {
                    tags.map((item) => (
                        <button
                            key={item[0] as Key}
                            type="button"
                            className={`filter-item${item[0] === tag ? " filter-item-active" : ""}`}
                            onClick={() => selectTag(item[0])}
                        >
                            {item[1]}
                        </button>
                    ))
                }
            </div>

            {/* px-[3%] matches .main-gallery so the box lines up with the cards */}
            <div className="px-[3%]">
                <input
                    className="search-box"
                    type="search"
                    value={query}
                    aria-label="Search posts"
                    placeholder="Search title, summary, tags or post text"
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            <p className="text-center py-[1%]">{shown.length} of {posts.length} posts</p>

            {
                shown.length === 0
                ? <p className="text-center py-[3%]">No posts match this filter.</p>
                : <div className="main-gallery">
                    {
                        shown.map((post) => (
                            <Post key={post.slug as Key} item={post} onTag={selectTag} />
                        ))
                    }
                  </div>
            }
        </div>
    )
}
