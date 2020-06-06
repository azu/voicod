import { Sentence } from "./Sentence";

export class SpeakerMemoryId {
    type = "SpeakerMemoryId" as const;

    constructor(public value: string) {}
}

export type SpeakerMemoryProps = {
    id: SpeakerMemoryId;
    sentences: Sentence[];
};

export class SpeakerMemory implements SpeakerMemoryProps {
    id!: SpeakerMemoryId;
    sentences!: Sentence[];

    constructor(props: SpeakerMemoryProps) {
        Object.assign(this, props);
    }

    get hasMemory() {
        return this.sentences.length > 0;
    }

    addSpokenSentence(sentence: Sentence) {
        return new SpeakerMemory({
            ...this,
            sentences: this.sentences.concat(sentence),
        });
    }

    removeSentences(removeSentences: Sentence[]) {
        return new SpeakerMemory({
            ...this,
            sentences: this.sentences.filter((sentence) => {
                return !removeSentences.includes(sentence);
            }),
        });
    }

    format() {
        return this.sentences.map((sentence) => sentence.value).join("\n");
    }
}
