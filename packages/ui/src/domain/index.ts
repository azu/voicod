import { Speaker, SpeakerId } from "./Speaker";
import { SpeakerMemory, SpeakerMemoryId } from "./SpeakerMemory";
import { ulid } from "ulid";

export const createSpeaker = () => {
    return new Speaker({
        id: new SpeakerId(ulid()),
        memory: new SpeakerMemory({
            id: new SpeakerMemoryId(ulid()),
            sentences: [],
        }),
    });
};
