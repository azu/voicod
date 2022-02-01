import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { speakerSpeakSentenceUseCase } from "./SpeakerSpeakSentenceUseCase";
import type { SpeechRecognition } from "./SpeechRecognition";
import { useTabVisibility } from "../hooks/use-tab-visibility";
import { useTabFocus } from "../hooks/use-tab-focus";
import type { JSXInternal } from "preact/src/jsx";

export type VoiceUIStatus = "user-want-to-stop" | "pause" | "processing" | "error";

// https://github.com/1heisuzuki/speech-to-text-webcam-overlay/blob/master/index.html
const _SpeechRecognition =
    (window as any).SpeechRecognition ?? ((window as any).webkitSpeechRecognition as SpeechRecognition);
export type VoiceUIProps = {
    forever: boolean;
} & JSXInternal.HTMLAttributes<HTMLDivElement>;
export const VoiceUI = (props: VoiceUIProps) => {
    const { forever, ...divProps } = props;
    const [status, setStatus] = useState<VoiceUIStatus>("pause");
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [text, setText] = useState("");
    const visible = useTabVisibility();
    const tabFocus = useTabFocus();
    useEffect(() => {
        // 参考: https://jellyware.jp/kurage/iot/webspeechapi.html
        const lang = "ja-JP";
        const _recognition: SpeechRecognition = new _SpeechRecognition();
        console.log("_recognition", _recognition);
        // @ts-ignore
        const restart = async () => {
            if (_recognition) {
                await _recognition.stop();
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await _recognition.start();
                setStatus("processing");
            }
        };
        _recognition.lang = lang;
        _recognition.interimResults = true;
        _recognition.continuous = true;
        _recognition.onsoundstart = function () {
            console.info("[speech] onsoundstart");
            setStatus("pause");
        };
        _recognition.onnomatch = function () {
            console.info("[speech] onnomatch");
            setStatus("error");
        };
        _recognition.onerror = function () {
            console.info("[speech] onerror");
            setStatus("error");
            if (visible) {
                // restart();
            }
        };
        _recognition.onsoundend = function () {
            console.info("[speech] onsoundend");
            setStatus("pause");
        };
        _recognition.onend = function () {
            console.info("[speech] onend");
            setStatus("pause");
        };
        _recognition.onspeechstart = function () {
            console.info("[speech] onspeechstart");
            setStatus("processing");
        };
        _recognition.onspeechend = function () {
            console.info("[speech] onspeechend");
            setStatus("pause");
        };
        _recognition.onresult = function (event) {
            const results = Array.from(event.results);
            console.log(event.resultIndex, results);
            // continuousの時は、前回の要素もeventに入ってる
            // 最後のresultが現在の最新のものとして扱う
            const lastResult = results[results.length - 1];
            const isCurrentProcessFinish = lastResult.isFinal;
            if (isCurrentProcessFinish) {
                setText(lastResult[0].transcript);
                speakerSpeakSentenceUseCase().execute(lastResult[0].transcript);
            } else {
                // 処理中のテキスト
                const restResults = results.slice(event.resultIndex);
                const processingResults = restResults.filter((result) => !result.isFinal);
                const processingText = processingResults.map((result) => result[0].transcript).join("");
                setText(processingText);
            }
        };
        setRecognition(_recognition);
        if (visible) {
            _recognition.start();
            setStatus("processing");
        } else {
            _recognition.stop();
        }
        return () => {
            recognition?.stop();
        };
    }, [visible]);
    useEffect(() => {
        if (tabFocus && status !== "processing") {
            console.log("reactive");
            setStatus("processing");
            recognition?.start();
        }
    }, [tabFocus]);
    const onClickToggleButton = useCallback(() => {
        if (status === "processing") {
            setStatus("user-want-to-stop");
            recognition?.stop();
        } else {
            setStatus("processing");
            recognition?.start();
        }
    }, [recognition, status]);
    return (
        <div class={"VoiceUI"} {...divProps}>
            <div style={{ display: "flex", height: "1em", alignItems: "center", gap: "4px" }}>
                <button class={"VoiceUI-toggleButton"} onClick={onClickToggleButton}>
                    {status === "processing" ? "Stop" : "Start"}
                </button>
                <p class={"VoiceUI-status"}>Status: {status}</p>
            </div>
            <p class={"VoiceUI-text"}>{text}</p>
        </div>
    );
};
