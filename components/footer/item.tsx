import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FooterItem({ item }) {
    return (
        <div className="px-[10%] text-lg text-black">
            <a className='hover:text-indigo-600' href={item[2]} target='_blank'><FontAwesomeIcon icon={item[1]} /> {item[0]}</a> 
        </div>
    )
}