import styles from '@/components/card/card.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tags from "@/components/tags.json";

const LABELS = Object.fromEntries(tags as string[][]);


export default function Post({ item, onTag }) {
    const url = `/others/blog/${item.slug}`;

    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                <Link className="underline hover:text-violet-700" href={url}>{item.title}</Link>
            </div>

            <div className={styles.cardDesc}>
                <p><FontAwesomeIcon icon={"fa-solid fa-calendar-days" as IconProp} /> {item.label}</p>
                {
                    item.tags.length === 0 ? null :
                    <p>
                        <FontAwesomeIcon icon={"fa-solid fa-tags" as IconProp} />{" "}
                        {
                            // Buttons rather than links to #tag: this card sits on the blog list
                            // itself, and useTab only reads the hash on mount, so a same-page hash
                            // link would change the URL and leave the filter where it was.
                            item.tags.map((tag, index) => (
                                <span key={tag}>
                                    {index === 0 ? "" : ", "}
                                    <button type="button" className="underline hover:text-violet-700" onClick={() => onTag(tag)}>
                                        {LABELS[tag]}
                                    </button>
                                </span>
                            ))
                        }
                    </p>
                }
            </div>

            <div className={styles.cardPartition}></div>
            <p>
                {item.summary}{" "}
                <Link className="underline hover:text-violet-700" href={url}>
                    read more <FontAwesomeIcon icon={"fa-solid fa-chevron-right" as IconProp} />
                </Link>
            </p>
        </div>
    )
}
