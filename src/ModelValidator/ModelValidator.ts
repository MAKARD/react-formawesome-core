import * as ClassValidator from "class-validator";

import {
    InstantiatableValidationModelInterface,
    ValidationModelInterface,
    ModelContainerInterface,
    UncertainObject,
    ModelValue
} from "./ModelValidatorInterfaces";

import * as Checkers from "./utils/checkers";

export class ModelValidator {
    constructor(Model: ValidationModelInterface, defaults?: UncertainObject) {
        this.instantiateModel(Model, defaults);
    }

    private modelContainer: ModelContainerInterface = {};

    public get modelAttributes(): Array<string> {
        return Object.keys(this.modelContainer.instance);
    }

    public get modelValues(): Array<ModelValue> {
        return this.modelAttributes
            .map((attribute) => ({
                attribute,
                value: this.modelContainer.instance[attribute]
            }));
    }

    public setDefaults = (defaults: UncertainObject): void => {
        Checkers.checkForDefaults(defaults);

        this.modelContainer.defaults = defaults;
    }

    public dropToDefaults = (): void => {
        this.modelContainer.instance = new this.modelContainer.Model(this.modelContainer.defaults);
    }

    private instantiateModel = (Model: ValidationModelInterface, defaults?: UncertainObject): void => {
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
