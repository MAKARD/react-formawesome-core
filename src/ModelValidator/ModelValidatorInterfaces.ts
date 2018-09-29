export type UncertainObject = { [key: string]: any };

export type ValidationModelInterface = UncertainObject;

export interface InstantiatableValidationModelInterface extends ValidationModelInterface {
    new(defaults?: UncertainObject): ValidationModelInterface;
}

export interface ModelContainerInterface {
    Model?: InstantiatableValidationModelInterface;
    instance?: ValidationModelInterface;
    defaults?: UncertainObject;
}

export interface ModelValue {
    attribute: string;
    value: string;
}
