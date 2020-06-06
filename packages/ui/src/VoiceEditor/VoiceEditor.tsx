import { createRef, h } from "preact";
import { EditorView } from "@codemirror/next/view";
import { EditorState } from "@codemirror/next/state";
import { lineNumbers } from "@codemirror/next/gutter";
import { specialChars } from "@codemirror/next/special-chars";
import { history } from "@codemirror/next/history/src/history";
import { foldCode, foldGutter, unfoldCode } from "@codemirror/next/fold";
import { multipleSelections } from "@codemirror/next/multiple-selections";
import { search } from "@codemirror/next/search";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import { closeBrackets } from "@codemirror/next/closebrackets";
import { autocomplete, startCompletion } from "@codemirror/next/autocomplete";
import { keymap } from "@codemirror/next/keymap";
import { baseKeymap, indentSelection, moveLineDown } from "@codemirror/next/commands";
import { lineComment, lineUncomment, toggleBlockComment, toggleLineComment } from "@codemirror/next/comment";
import { useEffect } from "preact/hooks";
import * as VoiceEditorState from "./VoiceEditorState";
import { updateSpokenSentenceUseCase } from "./UpdateSpokenSentenceUseCase";

export const VoiceEditor = () => {
    const ref = createRef();
    let editorView: EditorView;
    useEffect(() => {
        editorView = new EditorView({
            state: EditorState.create({
                doc: "",
                extensions: [
                    lineNumbers(),
                    specialChars(),
                    history(),
                    foldGutter(),
                    multipleSelections(),
                    search({}),
                    bracketMatching(),
                    closeBrackets,
                    autocomplete(),
                    keymap({
                        ...baseKeymap,
                        Tab: indentSelection,
                        "Shift-Tab": indentSelection,
                        "Meta-Alt-[": foldCode,
                        "Meta-Alt-]": unfoldCode,
                        "Meta-Space": startCompletion,
                        "Meta-/": toggleLineComment,
                        "Meta-Alt-/": lineComment,
                        "Meta-Alt-Shift-/": lineUncomment,
                        "Meta-*": toggleBlockComment,
                    }),
                ],
            }),
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
                        from: editorView.state.selection.primary.from,
                        insert: sentence.toSentence(),
                    };
                }),
            });
            editorView.dispatch(transaction);
            moveLineDown(editorView);
            updateSpokenSentenceUseCase().execute(state.addingSentences);
        });
        editorView.focus();
        return () => {
            editorView.destroy();
            ref.current?.remove();
        };
    }, []);
    return <div className={"VoiceEditor"} ref={ref} />;
};
