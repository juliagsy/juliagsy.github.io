import Head from "next/head";

export default function PdfRedirect({ pdf, title, linkLabel }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta httpEquiv="refresh" content={`0; url=${pdf}`} />
            </Head>
            <p className="text-center py-[20%]">
                <a href={pdf}>{linkLabel}</a>
            </p>
        </>
    );
}
