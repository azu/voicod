import { eventmit } from "eventmit";
import type { Speaker } from "../domain/Speaker";

export class DomainMap<Domain extends Speaker> extends Map<Domain["id"], Domain> {
    private __last__value__: undefined | Domain;
    private events = eventmit<void>();

    read(): undefined | Domain {
        return this.__last__value__;
    }

    write(entity: Domain): this {
        return this.set(entity.id, entity);
    }

    set(key: Domain["id"], value: Domain): this {
        super.set(key, value);
        this.__last__value__ = value;
        this.events.emit();
        return this;
    }

    onChange(changeHandler: () => void): () => void {
        this.events.on(changeHandler);
        return () => {
            this.events.off(changeHandler);
        };
    }
}

export const createCounterRepository = <T extends Speaker>() => {
    return new DomainMap<T>();
};

export const speakerRepository = createCounterRepository();
