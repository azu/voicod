import { useCallback, useEffect, useState } from "preact/hooks";

export const useTabFocus = () => {
    const [hasFocus, setHasFocus] = useState(true);
    const onFocus = useCallback(() => setHasFocus(true), [setHasFocus]);
    const onBlur = useCallback(() => setHasFocus(false), [setHasFocus]);
    useEffect(() => {
        window.addEventListener("focus", onFocus, false);
        window.addEventListener("blur", onBlur, false);
        return () => {
            document.removeEventListener("blur", onBlur);
            document.removeEventListener("focus", onFocus);
        };
    }, [onBlur, onFocus]);

    return hasFocus;
};
