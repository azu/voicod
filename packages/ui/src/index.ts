import { runApp } from "./App";

const run = () => {
    const app = document.querySelector("#js-app") as HTMLElement;
    runApp(app);
};

run();
