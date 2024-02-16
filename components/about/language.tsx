import data from "@/components/data.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Key } from "react";

function LanguageItem({ item }) {
    return (
        <div>
            <p className='capitalize text-base md:text-lg lg:text-xl'>{item[0]}</p>
            <p className="text-sm md:text-base lg:text-lg"><FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} /> {item[1].join(", ")}</p>
        </div>
    )
}

export default function Language() {
    return (
        <div className="grid grid-cols-1 gap-2">
            {
                data.languages.map((item) => (
                    <LanguageItem key={item[0] as Key} item={item} />
                ))
            }
        </div>
    )
}