import { h, render } from "preact";
import { Editor } from "./Editor";

export const App = () => {
    return (
        <main>
            <Editor />
        </main>
    );
};

export const runApp = (element: HTMLElement) => {
    render(<App />, element);
};
