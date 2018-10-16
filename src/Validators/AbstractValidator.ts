import * as Checkers from "./utils/checkers";

export interface UncertainObject<ReturnType = any> {
    [key: string]: ReturnType;
};

export type ValidationModelInterface = UncertainObject;

export interface ModelContainerInterface {
    instance?: ValidationModelInterface;
    defaults?: UncertainObject<string>;
}

export interface ValidatorPublicInterface {
    modelName: string;
    modelValues: UncertainObject;
    modelErrors: UncertainObject;
    modelAttributes: Array<string>;

    dropToDefaults: () => void;
    setDefaults: (defaults: UncertainObject) => void;
    validate: (groups?: Array<string>) => Promise<void>;
    setModelValue: (attribute: string, value: any) => void;
    addErrors: (errors: Array<{ attribute: string, details: string }>) => void;
}

export abstract class AbstractValidator implements ValidatorPublicInterface {
    public abstract validate: (groups?: Array<string>) => Promise<void>;
    public abstract get modelName(): string;

    protected modelErrorsContainer: Map<string, Array<{ attribute: string, details: string }>> = new Map();
    protected modelContainer: ModelContainerInterface = {};

    // #region Getters
    public get modelAttributes(): Array<string> {
        return Object.keys(this.modelContainer.instance);
    }

    public get modelValues(): UncertainObject {
        const values = {};
        this.modelAttributes.forEach((attribute) => {
            if (this.modelContainer.instance[attribute] !== undefined) {
                values[attribute] = this.modelContainer.instance[attribute];
            }
        });

        return values;
    }

    public get modelErrors(): UncertainObject<string> {
        const errors = {};

        Array.from(this.modelErrorsContainer.keys())
            .forEach((group) =>
                this.modelErrorsContainer.get(group)
                    .forEach(({ attribute, details }) => {
                        errors[attribute] = details;
                    })
            );

        return errors;
    }
    // #endregion

    // #region Setters
    public setModelValue = (attribute: string, value: any): void => {
        Checkers.checkForAttribute(this.modelAttributes, attribute, this.modelName);
        Checkers.checkForValue(attribute, value);

        this.modelContainer.instance[attribute] = value;
    }

    public setDefaults = (defaults: UncertainObject<string>): void => {
        Checkers.checkForDefaults(defaults);

        this.modelContainer.defaults = defaults;
    }

    public dropToDefaults = (): void => {
        this.modelAttributes.forEach((attribute) => {
            if (this.modelContainer.defaults[attribute] !== undefined) {
                this.modelContainer.instance[attribute] = this.modelContainer.defaults[attribute];
            }
        });

        this.modelErrorsContainer.clear();
    }

    public clear = (): void => {
        this.modelAttributes.forEach((attribute) => {
            this.modelContainer.instance[attribute] = undefined;
        });

        this.modelErrorsContainer.clear();
    }

    public addErrors = (errors: Array<{ attribute: string, details: string }>): void => {
        errors.forEach(({ attribute, details }) => {
            Checkers.checkForAttribute(this.modelAttributes, attribute, this.modelName);
            Checkers.checkForDetails(details);

            this.modelErrorsContainer.set(attribute, [{ attribute, details }]);
        });
    }
    // #endregion

    protected handleErrors = (errors, groups): void => {
        Checkers.checkForGroup(errors, groups, this.modelName);

        if (!groups) {
            this.modelErrorsContainer.clear();
            return this.addErrors(this.convertVendorErrors(errors));
        }

        groups.forEach((group) => this.modelErrorsContainer.set(
            group,
            this.convertVendorErrors(errors)
        ));
    }

    protected protectContainer = (): void => {
        Object.freeze(this.modelContainer);
        Object.seal(this.modelContainer.instance);
    }

    private convertVendorErrors = (errors) => errors.map(({ property, constraints }) => ({
        attribute: property,
        details: constraints[Object.keys(constraints)[0]]
    }));
}
