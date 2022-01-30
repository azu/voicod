import { speakerRepository } from "../infra/SpeakerRepository";
import { memorizePredableStore } from "../frameworks/MemorizePredableStore";

export const createVoiceUIStore = (infra = { speakerRepository }) => {
    const get = () => {
        return { speaker: infra.speakerRepository.read() };
    };
    const select = <R>(selector: (domains: ReturnType<typeof get>) => R): R => {
        return selector(get());
    };
    const onChange = (changeHandler: () => void) => {
        const unListenHandlers = Object.values(infra).map((repository) => {
            return repository.onChange(changeHandler);
        });
        return () => {
            unListenHandlers.forEach((unListen) => unListen());
        };
    };
    return {
        name: "VoiceUIStore",
        get,
        select,
        onChange,
    };
};
export const store = memorizePredableStore(createVoiceUIStore());
export const getState = () => {
    return {
        // lastSpeak: store.select(({ speaker }) => speaker?.memory ?? 0)
    };
};
export const onChange = store.onChange;
