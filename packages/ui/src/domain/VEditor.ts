import { ulid } from "ulid";

export class VEditorId {
    type = "VEditorId" as const;

    constructor(public value: string) {}
}

export type VEditor = {
    id: VEditorId;
    text: string;
};
export type UpdatableVEditorProps = Omit<VEditor, "id">;
export const createVEditor = (text = ""): VEditor => {
    const id = new VEditorId(ulid());
    return {
        id,
        text,
    };
};

export const updateVEditor = (vEditor: VEditor, newVEditor: Partial<UpdatableVEditorProps>): VEditor => {
    return {
        ...vEditor,
        ...newVEditor,
        id: vEditor.id,
    };
};
