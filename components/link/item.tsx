import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LinkItem({ css, url }) {
    return (
        <div className="px-[10%] text-xl">
            <a href={url} target='_blank'><FontAwesomeIcon icon={css} /></a> 
        </div>
    )
}