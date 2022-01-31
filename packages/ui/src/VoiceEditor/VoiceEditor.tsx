import { createRef, h } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import { updateSpokenSentenceUseCase } from "./UpdateSpokenSentenceUseCase";
import * as VoiceEditorState from "./VoiceEditorState";
import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup";
import { cursorDocEnd, cursorLineDown } from "@codemirror/commands";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { JSXInternal } from "preact/src/jsx";

export type VoiceEditorProps = JSXInternal.HTMLAttributes<HTMLDivElement>;
export const VoiceEditor = (props: VoiceEditorProps) => {
    const { ...divProps } = props;
    const [storage, setStorage] = useLocalStorage("VoiceEditor", "");
    const ref = createRef();
    let editorView: EditorView;
    const updateListenerExtension = useCallback(() => {
        return EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                setStorage(update.state.doc.toString());
            }
        });
    }, []);
    useEffect(() => {
        const editorState = EditorState.create({
            doc: storage,
            extensions: [basicSetup, updateListenerExtension()],
        });
        editorView = new EditorView({
            state: editorState,
        });
        ref.current?.appendChild(editorView.dom);
        cursorDocEnd(editorView); // move to end of doc
        VoiceEditorState.onChange(() => {
            const state = VoiceEditorState.getState();
            if (!state.hasAddingSentences) {
                return;
            }
            const transaction = editorView.state.update({
                changes: state.addingSentences.map((sentence) => {
                    return {
                        from: editorView.state.selection.ranges[0].to,
                        insert: sentence.toSentence(),
                    };
                }),
            });
            editorView.dispatch(transaction);
            cursorLineDown(editorView);
            updateSpokenSentenceUseCase().execute(state.addingSentences);
        });
        editorView.focus();
        return () => {
            editorView.destroy();
            ref.current?.remove();
        };
    }, []);
    return <div className={"VoiceEditor"} ref={ref} {...divProps} />;
};
