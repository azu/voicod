import { SpeakerMemory } from "./SpeakerMemory";
import { Sentence } from "./Sentence";

export class SpeakerId {
    type = "SpeakerId" as const;

    constructor(public readonly value: string) {}
}

export type SpeakerProps = {
    id: SpeakerId;
    memory: SpeakerMemory;
};

export class Speaker implements SpeakerProps {
    id: SpeakerId;
    memory: SpeakerMemory;

    constructor(props: SpeakerProps) {
        this.id = props.id;
        this.memory = props.memory;
    }

    speak(sentence: Sentence) {
        return new Speaker({
            ...this,
            memory: this.memory.addSpokenSentence(sentence),
        });
    }

    writeSpokenSentences(sentences: Sentence[]) {
        return new Speaker({
            ...this,
            memory: this.memory.removeSentences(sentences),
        });
    }
}
