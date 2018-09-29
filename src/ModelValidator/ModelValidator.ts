import * as ClassValidator from "class-validator";

import {
    InstantiatableValidationModelInterface,
    ValidationModelInterface,
    ModelContainerInterface,
    UncertainObject
} from "./ModelValidatorInterfaces";

import * as Checkers from "./utils/checkers";

export class ModelValidator {
    private modelErrorsContainer: Map<string, Array<{ attribute: string, details: string }>> = new Map();
    private modelContainer: ModelContainerInterface = {};

    constructor(Model: ValidationModelInterface, defaults?: UncertainObject<string>) {
        this.instantiateModel(Model, defaults);
    }

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

    public get modelName(): string {
        return this.modelContainer.instance.constructor.name;
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

    public validate = async (groups?: Array<string>): Promise<void> => {
        const errors = await ClassValidator.validate(
            this.modelContainer.instance,
            {
                ...groups ? { groups } : {},
                skipMissingProperties: true,
                forbidUnknownValues: true,
                validationError: {
                    target: false,
                    value: false
                }
            }
        );

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

    private instantiateModel = (Model: ValidationModelInterface, defaults?: UncertainObject<string>): void => {
        Checkers.checkForModel(Model);
        defaults !== undefined && Checkers.checkForDefaults(defaults);

        const instance = new (Model as InstantiatableValidationModelInterface)();

        Checkers.checkForInstance(instance);

        this.modelContainer = { instance, defaults };

        defaults && this.dropToDefaults();
    }
}
