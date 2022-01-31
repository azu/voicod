import { h, render } from "preact";
import { VoiceEditor } from "./VoiceEditor/VoiceEditor";
import { VoiceUI } from "./VoiceUI/VoiceUI";

export const App = () => {
    return (
        <main style={{ display: "flex", flexDirection: "column" }} className={"main"}>
            <VoiceEditor style={{ flex: 1, overflow: "auto" }} />
            <VoiceUI forever={true} style={{ height: "100px", paddingLeft: "20px", paddingTop: "20px" }} />
        </main>
    );
};

export const runApp = (element: HTMLElement) => {
    render(<App />, element);
};
