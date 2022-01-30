import { createRef, h } from "preact";
import { useEffect } from "preact/hooks";
import { updateSpokenSentenceUseCase } from "./UpdateSpokenSentenceUseCase";
import * as VoiceEditorState from "./VoiceEditorState";
import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup";
import { cursorLineDown } from "@codemirror/commands";

export const VoiceEditor = () => {
    const ref = createRef();
    let editorView: EditorView;
    useEffect(() => {
        const editorState = EditorState.create({
            doc: "", extensions: [
                basicSetup
            ]
        });
        editorView = new EditorView({
            state: editorState
        });
        ref.current?.appendChild(editorView.dom);
        VoiceEditorState.onChange(() => {
            const state = VoiceEditorState.getState();
            if (!state.hasAddingSentences) {
                return;
            }
            const transaction = editorView.state.update({
                changes: state.addingSentences.map((sentence) => {
                    return {
                        from: editorView.state.selection.ranges[0].to,
                        insert: sentence.toSentence()
                    };
                })
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
    return <div className={"VoiceEditor"} ref={ref}/>;
};
