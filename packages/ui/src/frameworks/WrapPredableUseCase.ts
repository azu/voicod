import { log } from "./Logger";

export type UseCaseFunction = { execute(...args: any[]): any };

type InfraParameter = {
    [index: string]: any;
};
export type CreateUseCase<Infra extends InfraParameter = any> = (infra?: Infra) => UseCaseFunction;
export const wrapPredableUseCase = <Infra extends InfraParameter>(createUseCase: CreateUseCase<Infra>) => {
    return (infra?: Infra) => {
        const originalUseCase = createUseCase(infra);
        const execute = (...args: any[]): any => {
            log(`[${createUseCase.name}] Execute UseCase`);
            return originalUseCase.execute(...args);
        };
        return {
            execute,
        };
    };
};
