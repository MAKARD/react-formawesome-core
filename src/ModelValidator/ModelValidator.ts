import * as ClassValidator from "class-validator";

import {
    InstantiatableValidationModelInterface,
    ValidationModelInterface,
    ModelContainerInterface,
    UncertainObject
} from "./ModelValidatorInterfaces";

import * as Checkers from "./utils/checkers";

export class ModelValidator {
    constructor(Model: ValidationModelInterface, defaults?: UncertainObject<string>) {
        this.instantiateModel(Model, defaults);
    }

    private modelErrorsContainer: Map<string, Array<{ attribute: string, details: string }>> = new Map();
    private modelContainer: ModelContainerInterface = {};

    public get modelAttributes(): Array<string> {
        return Object.keys(this.modelContainer.instance);
    }

    public get modelValues(): UncertainObject<string> {
        let values = {};
        this.modelAttributes.forEach((attribute) => {
            values[attribute] = this.modelContainer.instance[attribute];
        });

        return values;
    }

    public get modelErrors(): UncertainObject<string> {
        let errors = {};

        Array.from(this.modelErrorsContainer.keys())
            .forEach((group) =>
                this.modelErrorsContainer.get(group)
                    .forEach(({ attribute, details }) => {
                        errors[attribute] = details;
                    })
            );

        return errors;
    }

    public setDefaults = (defaults: UncertainObject<string>): void => {
        Checkers.checkForDefaults(defaults);

        this.modelContainer.defaults = defaults;
    }

    public dropToDefaults = (): void => {
        this.modelContainer.instance = new this.modelContainer.Model(this.modelContainer.defaults);
    }

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

        if (errors.some(({ property }) => property === undefined)) {
            throw new Error(
                `Some of passed validation groups (${JSON.stringify(groups)}) does not defined in model. ` +
                `Check '${this.modelContainer.Model.name}' model rules definition`
            );
        }

        if (!groups) {
            this.modelErrorsContainer.clear();
            return errors.forEach(({ property, constraints }) => {
                this.modelErrorsContainer.set(property, [{
                    attribute: property,
                    details: constraints[Object.keys(constraints)[0]]
                }]);
            });
        }

        groups.forEach((group) => {
            this.modelErrorsContainer.set(group, errors.map(({ property, constraints }) => ({
                attribute: property,
                details: constraints[Object.keys(constraints)[0]]
            })));
        });
    }

    private instantiateModel = (Model: ValidationModelInterface, defaults?: UncertainObject<string>): void => {
        Checkers.checkForModel(Model);
        defaults !== undefined && Checkers.checkForDefaults(defaults);

        const instance = new (Model as InstantiatableValidationModelInterface)(defaults);

        Checkers.checkForInstance(instance);

        this.modelContainer = {
            Model: Model as InstantiatableValidationModelInterface,
            instance,
            defaults
        };
    }
}
