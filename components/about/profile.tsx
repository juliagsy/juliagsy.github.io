import data from "@/components/data.json";
import Link from "@/components/about/link";

export default function Profile() {
    return (
        <div className="m-[5%]">
            <div className="flex flex-row">
                <p className="text-3xl">{data.name}</p>
                <Link />
            </div>
            <p className="text-base">{data.about}</p>
        </div>
    )
}