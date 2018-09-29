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

    private modelErrorsContainer: Map<string, string> = new Map();
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

    public get modelGroups(): UncertainObject<Array<string>> {
        if (this.modelContainer.instance.groups) {
            return this.modelContainer.instance.groups;
        }

        let groups = {};

        this.modelAttributes.forEach((attribute) => {
            groups[attribute] = [attribute];
        });

        return groups;
    }

    public get modelErrors(): UncertainObject<string> {
        let errors = {};

        Array.from(this.modelErrorsContainer.keys())
            .forEach((attribute) => {
                errors[attribute] = this.modelErrorsContainer.get(attribute);
            });

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

        if (!groups) {
            this.modelErrorsContainer.clear()
        } else {
            // groups.
        }
        // const oldErrors = group === undefined
        //     ? []
        //     : this.errors.filter(({ attribute }) => !(this.groups()[group] || []).includes(attribute));

        errors.forEach(({ property, constraints }) => {
            this.modelErrorsContainer.set(property, Object.keys(constraints)[0]);
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
