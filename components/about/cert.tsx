import data from "@/components/data.json";

function CertItem({ item }) {
    return (
        <div className="text-lg">
            <a className='underline hover:text-indigo-400' href={item[1]} target="_blank">{item[0]}</a>
        </div>
    )
}

export default function Cert() {
    return (
        <div className="gap-2">
            {
                data.certifications.map((item) => (
                    <CertItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}