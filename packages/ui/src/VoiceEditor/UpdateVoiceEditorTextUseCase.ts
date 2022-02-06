import { vEditorRepository } from "../infra/VEditorRepository";
import { createVEditor, updateVEditor, VEditor } from "../domain/VEditor";

export function UpdateVoiceEditorTextUseCase(infra = { vEditorRepository }) {
    return (text: VEditor["text"]) => {
        const domain = infra.vEditorRepository.read() ?? createVEditor("");
        const newDomain = updateVEditor(domain, {
            text,
        });
        infra.vEditorRepository.write(newDomain);
    };
}

export const updateVoiceEditorTextUseCase = UpdateVoiceEditorTextUseCase();
