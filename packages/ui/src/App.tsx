import { h, render } from "preact";
import { VoiceEditor } from "./VoiceEditor/VoiceEditor";
import { VoiceUI } from "./VoiceUI/VoiceUI";

export const App = () => {
    return (
        <main>
            <VoiceEditor />
            <VoiceUI forever={true} />
        </main>
    );
};

export const runApp = (element: HTMLElement) => {
    render(<App />, element);
};
