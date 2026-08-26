import Head from "next/head";
import Link from "next/link";
import data from "@/components/data.json";

// Experiences was folded into /profile. Kept as a redirect so existing links,
// bookmarks and search results still land somewhere useful. Meta refresh
// rather than a router push, so it works with JavaScript disabled too.
export default function Experiences() {
    return (
        <div className="content">
            <Head>
                <title>{`${data.name} - Experiences`}</title>
                <meta httpEquiv="refresh" content="0; url=/profile#experiences" />
            </Head>
            <p className="text-center py-[3%]">
                Experiences now lives on <Link className="underline hover:text-violet-700" href="/profile#experiences">Profile</Link>.
            </p>
        </div>
    )
}
