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

// Logos with no FontAwesome equivalent, kept as black SVGs under static/logo.
// h-[1em] and align-[-0.125em] match how FontAwesome sizes and seats its own
// glyphs, so these line up with the icons either side of them.
function TechLogo({ item }) {
    return (
        <div className={`${styles.item} text-lg md:text-xl lg:text-2xl`}>
            <div>
                <img
                    className="inline-block h-[1em] w-auto align-[-0.125em]"
                    src={`/static/logo/${item[0]}.svg`}
                    alt={item[1]}
                />
            </div>
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
                {
                    (item[3] ?? []).map((logo) => (
                        <TechLogo key={logo[0]} item={logo} />
                    ))
                }
            </div>
        </div>
    )
}

export default function Tech() {
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
