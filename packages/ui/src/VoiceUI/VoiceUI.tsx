import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { speakerSpeakSentenceUseCase } from "./SpeakerSpeakSentenceUseCase";

export type VoiceUIStatus = "user-want-to-stop" | "pause" | "processing" | "error";
export type VoiceUIProps = {
    forever: boolean;
};
// https://github.com/1heisuzuki/speech-to-text-webcam-overlay/blob/master/index.html
const SpeechRecognition = window.SpeechRecognition ?? ((window as any).webkitSpeechRecognition as SpeechRecognition);
export const VoiceUI = (_props: VoiceUIProps) => {
    const [status, setStatus] = useState<VoiceUIStatus>("pause");
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [text, setText] = useState("");
    useEffect(() => {
        // 参考: https://jellyware.jp/kurage/iot/webspeechapi.html
        const lang = "ja-JP";
        const _recognition = new SpeechRecognition();
        // @ts-ignore
        const restart = () => {
            if (_recognition) {
                _recognition.start();
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
            // TODO: restart
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
            const results = event.results;
            console.log(event.resultIndex, results);
            for (let i = event.resultIndex; i < results.length; i++) {
                if (results[i].isFinal) {
                    const result_transcript = results[i][0].transcript;
                    setText(result_transcript);
                    speakerSpeakSentenceUseCase().execute(result_transcript);
                } else {
                    setText(results[i][0].transcript);
                }
            }
        };
        setRecognition(_recognition);
        _recognition.start();
        setStatus("processing");
        return () => {
            recognition?.stop();
        };
    }, []);
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
        <div class={"VoiceUI"}>
            <button class={"VoiceUI-toggleButton"} onClick={onClickToggleButton}>
                {status === "processing" ? "Stop" : "Start"}
            </button>
            <p class={"VoiceUI-status"}>Status: {status}</p>
            <p class={"VoiceUI-text"}>{text}</p>
        </div>
    );
};
