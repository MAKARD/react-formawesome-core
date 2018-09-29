export interface UncertainObject<ReturnType = any> {
    [key: string]: ReturnType;
};

export type ValidationModelInterface = UncertainObject;

export interface InstantiatableValidationModelInterface extends ValidationModelInterface {
    new(): ValidationModelInterface;
}

export interface ModelContainerInterface {
    instance?: ValidationModelInterface;
    defaults?: UncertainObject<string>;
}
