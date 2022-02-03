const LINE_END_PATTERN = /[!?。,、]$/;

const vcommand = (value: string) => {
    if (/(改行|開業|かいぎょう)$/.test(value)) {
        return value.replace(/(改行|開業|かいぎょう)$/, "\n");
    }
    return value + "\n";
};

export class Sentence {
    constructor(public value: string) {}

    toSentence() {
        return LINE_END_PATTERN.test(this.value) ? vcommand(this.value) : vcommand(this.value);
    }
}
