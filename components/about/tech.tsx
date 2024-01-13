import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from "@/components/data.json";


function TechItem({ fw, fa_category }) {
    return (
        <div className="text-xl">
            <div><FontAwesomeIcon icon={`fa-${fa_category} fa-${fw}`} /></div>
        </div>
    )
}

function TechStack({ item }) {
    return (
        <div className="text-xl">
            <p className='capitalize'>{item[0]}</p>
            <div className='flex flex-row gap-2'>
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
                    <TechStack key={item[0]} item={item} />
                ))
            }
        </div>
    )
}