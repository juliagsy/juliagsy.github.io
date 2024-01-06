import data from "@/components/data.json";

export default function Photo() {
    return (
        <div className="w-[50%]">
            <img className="rounded-full" src="/static/photo.jpg" alt={data.name} />
        </div>
    )
}