import data from "@/components/data.json";

export default function Photo() {
    return (
        <div>
            <img className="rounded-3xl" src="/static/photo.jpeg" alt={data.name} />
        </div>
    )
}
