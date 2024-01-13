import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from "@/components/data.json";

function LinkItem({ item }) {
    return (
        <div className="text-xl">
            <a className='hover:text-indigo-400' href={item[2]} target='_blank'><FontAwesomeIcon icon={item[1]} /></a> 
        </div>
    )
}

export default function Link() {
    return (
        <div className="grid grid-cols-3 gap-2 px-[2%]">
            {
                data.contacts.map((item) => (
                    <LinkItem key={item[0]} item={item} />
                ))
            }
        </div>
    )
}