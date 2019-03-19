import * as ClassValidator from "class-validator";

import { ValidationModelInterface, UncertainObject, AbstractValidator } from "../AbstractValidator";

import * as Checkers from "../utils/checkers";

export interface InstantiatableValidationModelInterface extends ValidationModelInterface {
    new(): ValidationModelInterface;
}

export class ModelValidator extends AbstractValidator {
    constructor(Model: ValidationModelInterface, defaults?: UncertainObject) {
        super();
        this.instantiateModel(Model, defaults);
    }

    public get modelName(): string {
        return this.modelContainer.instance.constructor.name;
    }

    public validate = (groups?: Array<string>): Promise<void> => {
        return ClassValidator.validate(this.modelContainer.instance,
            {
                ...groups ? { groups } : {},
                skipMissingProperties: true,
                validationError: {
                    target: false,
                    value: false
                }
            }).then((errors) => this.handleErrors(errors, groups))
    }

    private instantiateModel = (Model: ValidationModelInterface, defaults?: UncertainObject<string>): void => {
        Checkers.checkForModel(Model);

        const instance = new (Model as InstantiatableValidationModelInterface)();
        Checkers.checkForInstance(instance);

        defaults !== undefined && Checkers.checkForDefaults(defaults, Object.keys(instance));

        this.modelContainer = { instance, defaults: defaults || {} };

        this.protectContainer();

        defaults && this.dropToDefaults();
    }
}
