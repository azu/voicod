import { useEffect, useState } from "preact/hooks";

export type Store<T> = {
    onChange: (cb: () => unknown) => () => unknown;
    getState: () => T;
};
export const useStore = <T>(store: Store<T>) => {
    const [state, setState] = useState(store.getState());
    useEffect(() => {
        const unListen = store.onChange(() => {
            setState(store.getState());
        });
        return () => {
            unListen();
        };
    }, [store]);
    return state;
};
