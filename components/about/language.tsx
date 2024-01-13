import data from "@/components/data.json";

function LanguageItem({ item }) {
    return (
        <div className="text-lg">
            {item[0]}: {item[1]}
        </div>
    )
}

export default function Language() {
    return (
        <div className="gap-2">
            {
                data.languages.map((item) => (
                    <LanguageItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}