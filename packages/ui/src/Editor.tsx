import { h } from "preact";
import { EditorView } from "@codemirror/next/view";
import { EditorState } from "@codemirror/next/state";
import { lineNumbers } from "@codemirror/next/gutter";
import { specialChars } from "@codemirror/next/special-chars";
import { history, redo, undo } from "@codemirror/next/history/src/history";
import { foldCode, foldGutter, unfoldCode } from "@codemirror/next/fold";
import { multipleSelections } from "@codemirror/next/multiple-selections";
import { search } from "@codemirror/next/search";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import { closeBrackets } from "@codemirror/next/closebrackets";
import { autocomplete, startCompletion } from "@codemirror/next/autocomplete";
import { keymap } from "@codemirror/next/keymap";
import { baseKeymap, indentSelection } from "@codemirror/next/commands";
import { lineComment, lineUncomment, toggleBlockComment, toggleLineComment } from "@codemirror/next/comment";
import { useEffect } from "preact/hooks";
import { createRef } from "preact";

export const Editor = () => {
    const ref = createRef();
    let editorView: EditorView;
    useEffect(() => {
        editorView = new EditorView({
            state: EditorState.create({
                doc: "hello",
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
                        "Meta-Z": undo,
                        "Meta-Shift-Z": redo,
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
        return () => {
            editorView.destroy();
            ref.current?.remove();
        };
    }, []);
    return <div className={"Editor"} ref={ref} />;
};
