import { speakerRepository } from "../infra/SpeakerRepository";
import { memorizePredableStore } from "../frameworks/MemorizePredableStore";
import { vEditorRepository } from "../infra/VEditorRepository";

export const createEditorStore = (infra = { speakerRepository, vEditorRepository }) => {
    const get = () => {
        return { speaker: infra.speakerRepository.read(), vEditor: infra.vEditorRepository.read() };
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
const editorStore = memorizePredableStore(createEditorStore());
// @Cost: high
export const getState = (store = editorStore) => {
    return {
        editorText: store.select(({ vEditor }) => vEditor?.text ?? ""),
        hasAddingSentences: store.select(({ speaker }) => speaker?.memory.hasMemory ?? false),
        addingSentences: store.select(({ speaker }) => speaker?.memory.sentences ?? []),
    };
};
export const onChange = editorStore.onChange;
