import * as Checkers from "./utils/checkers";

export interface UncertainObject<ReturnType = any> {
    [key: string]: ReturnType;
};

export type ValidationModelInterface = UncertainObject;

export interface ModelContainerInterface {
    instance?: ValidationModelInterface;
    defaults?: UncertainObject<string>;
}

export abstract class AbstractValidator {
    public abstract validate: (groups?: Array<string>) => Promise<void>;
    public abstract get modelName(): string;

    protected modelErrorsContainer: Map<string, Array<{ attribute: string, details: string }>> = new Map();
    protected modelContainer: ModelContainerInterface = {};

    // #region Getters
    public get modelAttributes(): Array<string> {
        return Object.keys(this.modelContainer.instance);
    }

    public get modelValues(): UncertainObject<string> {
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
        Checkers.checkForAttributeValue(
            this.modelAttributes,
            this.modelName,
            attribute,
            value
        );

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
    // #endregion

    protected handleErrors = (errors, groups): void => {
        Checkers.checkForGroup(errors, groups, this.modelName);

        if (!groups) {
            this.modelErrorsContainer.clear();
            return errors.forEach(({ property, constraints }) => this.modelErrorsContainer.set(property, [{
                attribute: property,
                details: constraints[Object.keys(constraints)[0]]
            }]));
        }

        groups.forEach((group) => this.modelErrorsContainer.set(
            group,
            errors.map(({ property, constraints }) => ({
                attribute: property,
                details: constraints[Object.keys(constraints)[0]]
            })))
        );
    }
}
