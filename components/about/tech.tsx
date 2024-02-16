import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import data from "@/components/data.json";
import styles from "@/components/about/about.module.css"
import { Key } from 'react';


function TechItem({ fw, fa_category }) {
    return (
        <div className={`${styles.item} text-lg md:text-xl lg:text-2xl`}>
            <div><FontAwesomeIcon icon={`fa-${fa_category} fa-${fw}` as IconProp} /></div>
        </div>
    )
}

function TechStack({ item }) {
    return (
        <div>
            <p className='capitalize text-base md:text-lg lg:text-xl'>{item[0]}</p>
            <div className='flex flex-row flex-wrap gap-2'>
                {
                    item[1].map((fw) => (
                        <TechItem key={fw} fw={fw} fa_category="brands" />
                    ))
                }
                {
                    item[2].map((fw) => (
                        <TechItem key={fw} fw={fw} fa_category="solid" />
                    ))
                }
            </div>
        </div>
    )
}

export default function Tech() {
    const col_num = data.tech.length;

    return (
        <div className={`grid grid-cols-1 gap-2`}>
            {
                data.tech.map((item) => (
                    <TechStack key={item[0] as Key} item={item} />
                ))
            }
        </div>
    )
}