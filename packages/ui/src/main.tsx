import { h, render } from "preact";
import { App } from "./App";
import "./App.css";
import { useRegisterSW } from "virtual:pwa-register/preact";
render(<App />, document.getElementById("app")!);
const intervalMS = 60 * 60 * 1000;
useRegisterSW({
    onRegistered(r) {
        r &&
            setInterval(() => {
                r.update();
            }, intervalMS);
    },
});
