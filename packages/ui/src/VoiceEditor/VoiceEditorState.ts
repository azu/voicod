import { speakerRepository } from "../infra/SpeakerRepository";
import { memorizePredableStore } from "../frameworks/MemorizePredableStore";

export const createEditorStore = (infra = { speakerRepository }) => {
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
        name: "VoiceEditor",
        // @Cost: middle
        get,
        // @Cost: middle
        select,
        // @Cost, middle
        onChange,
    };
};
// @Cost: low
export const store = memorizePredableStore(createEditorStore());
// @Cost: high
export const getState = () => {
    return {
        hasAddingSentences: store.select(({ speaker }) => speaker?.memory.hasMemory ?? false),
        addingSentences: store.select(({ speaker }) => speaker?.memory.sentences ?? []),
    };
};
export const onChange = store.onChange;
