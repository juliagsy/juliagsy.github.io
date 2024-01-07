import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LinkItem({ item }) {
    return (
        <div className="text-xl">
            <a className='hover:text-indigo-400' href={item[2]} target='_blank'><FontAwesomeIcon icon={item[1]} /></a> 
        </div>
    )
}