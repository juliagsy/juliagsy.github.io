import LinkItem from "@/components/link/item";
import data from "@/components/data.json";

export default function Link() {
    return (
        <div className="grid grid-cols-3 gap-2 px-[2%]">
            {
                data.contacts.map((item) => (
                    <LinkItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}