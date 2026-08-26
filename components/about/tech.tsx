import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import data from "@/components/data.json";
import styles from "@/components/about/about.module.css"
import { Key } from 'react';


// Not every logo is recognisable on sight, so each one names itself on hover.
// The label also spells out what a stand-in icon stands for — the Microsoft
// mark is Azure, the plain C is C/C++, and so on.
function TechIcon({ label, children }) {
    return (
        <div className={`${styles.item} group relative text-lg md:text-xl lg:text-2xl`}>
            <div>{children}</div>
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border-[2px] border-solid border-black bg-white px-2 py-[1px] text-xs no-underline group-hover:block">
                {label}
            </span>
        </div>
    )
}

function TechItem({ item, fa_category }) {
    return (
        <TechIcon label={item[1]}>
            <FontAwesomeIcon icon={`fa-${fa_category} fa-${item[0]}` as IconProp} />
        </TechIcon>
    )
}

// Logos with no FontAwesome equivalent, kept as black SVGs under static/logo.
// h-[1em] and align-[-0.125em] match how FontAwesome sizes and seats its own
// glyphs, so these line up with the icons either side of them.
function TechLogo({ item }) {
    return (
        <TechIcon label={item[1]}>
            <img
                className="inline-block h-[1em] w-auto align-[-0.125em]"
                src={`/static/logo/${item[0]}.svg`}
                alt={item[1]}
            />
        </TechIcon>
    )
}

function TechStack({ item }) {
    return (
        <div>
            <p className='capitalize text-base md:text-lg lg:text-xl'>{item[0]}</p>
            <div className='flex flex-row flex-wrap gap-2'>
                {
                    item[1].map((tech) => (
                        <TechItem key={tech[0]} item={tech} fa_category="brands" />
                    ))
                }
                {
                    item[2].map((tech) => (
                        <TechItem key={tech[0]} item={tech} fa_category="solid" />
                    ))
                }
                {
                    item[3].map((tech) => (
                        <TechLogo key={tech[0]} item={tech} />
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
