import LinkItem from "@/components/link/item";
import data from "@/components/data.json";

export default function Link() {
    return (
        <div className="flex flex-row px-[2%]">
            {
                data.link.map(([name, css, url]) => (
                    <LinkItem key={name} css={css} url={url} />
                ))
            }
        </div>
    )
}