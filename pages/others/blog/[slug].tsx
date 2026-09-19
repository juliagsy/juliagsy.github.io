import Head from "next/head";
import Link from "next/link";
import data from "@/components/data.json";
import tags from "@/components/tags.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { listPosts, readPost } from "@/components/blog";

const LABELS = Object.fromEntries(tags as string[][]);

// fallback: false — every post is known at build time, and `output: 'export'`
// has no server to render a missing one on demand.
export async function getStaticPaths() {
    return {
        paths: listPosts().map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    return { props: readPost(params.slug) };
}

export default function PostPage({ meta, html }) {
    return (
        <div className="content">
            <Head>
                <title>{`${data.name} - ${meta.title}`}</title>
                <meta name="description" content={meta.summary} />
            </Head>

            {/* No flanking partitions here, unlike every other page title: a post title is
                long and wraps, and the gradient rules sit at its vertical centre rather than
                against a single line. Full width also stops a three-line title from being
                squeezed into the middle third of the grid. */}
            <div className="main-title">{meta.title}</div>

            <div className="post-meta">
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {meta.label}</p>
                {
                    meta.tags.length === 0 ? null :
                    <p>
                        <FontAwesomeIcon icon={"fa-solid fa-tags" as IconProp} />{" "}
                        {
                            meta.tags.map((tag, index) => (
                                <span key={tag}>
                                    {index === 0 ? "" : ", "}
                                    <Link className="underline hover:text-violet-700" href={`/others/blog#${tag}`}>{LABELS[tag]}</Link>
                                </span>
                            ))
                        }
                    </p>
                }
            </div>

            {/* Written by hand in content/blog and rendered by marked at build time. */}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="post-back-bar">
                <Link className="post-back" href="/others/blog">
                    <FontAwesomeIcon icon={"fa-solid fa-chevron-left" as IconProp} /> All Posts
                </Link>
            </div>
        </div>
    )
}
