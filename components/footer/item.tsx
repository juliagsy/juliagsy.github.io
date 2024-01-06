import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FooterItem({ name, css, url }) {
    return (
        <div className="px-[10%] text-xl text-black">
            <a href={url} target='_blank'><FontAwesomeIcon icon={css} />{name}</a> 
        </div>
    )
}