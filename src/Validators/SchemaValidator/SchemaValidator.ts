import * as ClassValidator from "class-validator";

import { AbstractValidator, UncertainObject, ValidatorConfig } from "../AbstractValidator";

import * as Checkers from "../utils/checkers";

export class SchemaValidator<ModelI = UncertainObject> extends AbstractValidator<ModelI> {
    private schemaName?: string;

    constructor(schema: ClassValidator.ValidationSchema, defaults?: ModelI, config?: ValidatorConfig) {
        super();

        if (config) {
            Checkers.checkForConfig(config);

            this.config = config;
            Object.seal(this.config);
        }

        this.instantiateModel(schema, defaults);
    }

    public get modelName() {
        return this.schemaName;
    }

    public validate = (groups?: Array<string>): Promise<void> => {
        return ClassValidator.validate(this.modelName,
            this.modelContainer.instance,
            {
                ...groups ? { groups } : {},
                skipMissingProperties: true,
                validationError: {
                    target: false,
                    value: false
                }
            }).then((errors) => this.handleErrors(errors, groups));
    }

    private instantiateModel = (schema: ClassValidator.ValidationSchema, defaults?: Partial<ModelI>): void => {
        Checkers.checkForSchema(schema);
        defaults !== undefined && Checkers.checkForDefaults(defaults, Object.keys(schema.properties));

        ClassValidator.registerSchema(schema);
        this.schemaName = schema.name;

        this.modelContainer = {
            instance: {},
            defaults: defaults || {}
        };

        Object.keys(schema.properties).forEach((attribute) => {
            this.modelContainer.instance[attribute] = undefined;
        });

        this.protectContainer();

        defaults && this.dropToDefaults();
    }

}
