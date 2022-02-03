import { h, render } from "preact";
import { VoiceEditor } from "./VoiceEditor/VoiceEditor";
import { VoiceUI } from "./VoiceUI/VoiceUI";
import { useRegisterSW } from "virtual:pwa-register/preact";

export const App = () => {
    const intervalMS = 60 * 60 * 1000;
    useRegisterSW({
        onRegistered(r) {
            r &&
                setInterval(() => {
                    r.update();
                }, intervalMS);
        },
    });
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
