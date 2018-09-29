export type UncertainObject<ReturnType = any> = { [key: string]: ReturnType };

export interface ValidationModelInterface extends UncertainObject {
    groups?: UncertainObject<Array<string>>;
}

export interface InstantiatableValidationModelInterface extends ValidationModelInterface {
    new(defaults?: UncertainObject<string>): ValidationModelInterface;
}

export interface ModelContainerInterface {
    Model?: InstantiatableValidationModelInterface;
    instance?: ValidationModelInterface;
    defaults?: UncertainObject<string>;
}
