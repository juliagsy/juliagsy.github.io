import data from "@/components/data.json";
import Link from "@/components/about/link";

export default function Profile() {
    return (
        <div className="m-[5%]">
            <p className="text-4xl">{data.name}</p>
            <div className="flex flex-row">
                <Link />
            </div>
            <p>{data.about}</p>
        </div>
    )
}