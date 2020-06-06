import { memorizePredableStore } from "./MemorizePredableStore";

export type PrediableStore<
    Domain extends {
        [index: string]: any | undefined;
    }
> = {
    name?: string;
    get(): Domain;
    select<R>(selector: (domain: Domain) => R): R;
    onChange(changeHandler: () => void): void;
};

type InfraParameter = {
    [index: string]: any;
};
type DomainParameter = {
    [index: string]: any | undefined;
};
export type CreateStore<Infra extends InfraParameter, Domain = DomainParameter> = (
    infra: Infra
) => PrediableStore<Domain>;

function assertIsStoreCreator(val: unknown): asserts val is CreateStore<{}> {
    if (typeof val !== "function") {
        throw new Error(`Store should be function`);
    }
}

function assertStoreArguments(args: unknown[]): asserts args is [InfraParameter] {
    if (args.length === 0) {
        throw new Error("Store should have infra parameter");
    }
}

export const wrapPredableStore = <T>(createStore: T): T => {
    assertIsStoreCreator(createStore);
    const wrappedSelector = (...args: any[]) => {
        assertStoreArguments(args);
        const store = createStore(...args);
        return memorizePredableStore({
            name: createStore.name,
            ...store,
        });
    };
    return (wrappedSelector as any) as T;
};
