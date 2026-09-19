import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


// Not a card, unlike everything else that sits in a .main-gallery. The Others page is a
// menu of two destinations, and a bordered box around a single line of text was more
// chrome than it earned. Topics and tags live on the destination pages, where the filter
// bar can act on a click; the deep links they used (/others/blog#ml) still work, because
// useTab reads the hash on mount.
export default function Tool({ item }) {
    return (
        <Link className="tool-link" href={item[1]}>
            <FontAwesomeIcon icon={item[2] as IconProp} /> {item[0]}
        </Link>
    )
}
