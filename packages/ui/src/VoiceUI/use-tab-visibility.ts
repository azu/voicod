import { useCallback, useEffect, useState } from "preact/hooks";

let hidden: string;
let visibilityChange: string;

if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
    // @ts-ignore
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
    // @ts-ignore
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

export const useTabVisibility = () => {
    const getVisibility = useCallback(() => {
        // @ts-ignore
        return !document[hidden];
    }, []);

    const [visible, setVisible] = useState(getVisibility());
    const handleVisibility = useCallback(() => setVisible(getVisibility()), [setVisible]);

    useEffect(() => {
        document.addEventListener(visibilityChange, handleVisibility, false);

        return () => document.removeEventListener(visibilityChange, handleVisibility);
    }, [handleVisibility]);

    return visible;
};
