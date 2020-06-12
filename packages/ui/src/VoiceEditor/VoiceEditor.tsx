import { createRef, h } from "preact";
import { EditorView } from "@codemirror/next/view";
import { EditorState } from "@codemirror/next/state";
import { lineNumbers } from "@codemirror/next/gutter";
import { specialChars } from "@codemirror/next/special-chars";
import { history, historyKeymap } from "@codemirror/next/history/src/history";
import { foldGutter, foldKeymap } from "@codemirror/next/fold";
import { multipleSelections } from "@codemirror/next/multiple-selections";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import { closeBrackets } from "@codemirror/next/closebrackets";
import { autocomplete, startCompletion } from "@codemirror/next/autocomplete";
import { keymap } from "@codemirror/next/keymap";
import { defaultKeymap, indentSelection, moveLineDown } from "@codemirror/next/commands";
import { useEffect } from "preact/hooks";
import { updateSpokenSentenceUseCase } from "./UpdateSpokenSentenceUseCase";
import { searchKeymap } from "@codemirror/next/search";
import { commentKeymap } from "@codemirror/next/comment";
import { gotoLine } from "@codemirror/next/goto-line";
import * as VoiceEditorState from "./VoiceEditorState";

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
                    bracketMatching(),
                    closeBrackets,
                    autocomplete(),
                    keymap([
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap,
                        ...commentKeymap,
                        //...lintKeymap,
                        // FIXME move into exported keymaps
                        { key: "Alt-g", run: gotoLine },
                        { key: "Shift-Tab", run: indentSelection },
                        { key: "Mod-Space", run: startCompletion }
                    ])
                ]
            })
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
                        insert: sentence.toSentence()
                    };
                })
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
    return <div className={"VoiceEditor"} ref={ref}/>;
};
