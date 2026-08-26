import { useEffect, useState } from "react";

/**
 * A tab selection mirrored in the URL hash, so any view can be linked to directly.
 * `ids` lists the valid tabs; the first is the default and is left hash-free.
 *
 * Writes with replaceState rather than assigning location.hash, which would stack
 * a history entry on every click and turn the back button into a filter rewind.
 */
export default function useTab(ids: string[]): [string, (id: string) => void] {
    const [tab, setTab] = useState(ids[0]);

    // Mount only: a deep link decides the opening tab, nothing after that.
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (ids.includes(hash)) setTab(hash);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const select = (id: string) => {
        setTab(id);
        window.history.replaceState(null, "", id === ids[0] ? window.location.pathname : `#${id}`);
    };

    return [tab, select];
}
