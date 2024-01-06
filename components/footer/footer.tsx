import FooterItem from "@/components/footer/item";
import data from "@/components/data.json";

export default function Footer() {
    return (
        <div className="fixed bottom-0 w-[100%] flex flex-col px-[2%] bg-white">
            {
                data.link.map(([name, css, url]) => (
                    <FooterItem key={name} name={name} css={css} url={url} />
                ))
            }
        </div>
    )
}