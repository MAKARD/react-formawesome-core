import * as ClassValidator from "class-validator";

import { AbstractValidator, UncertainObject } from "../AbstractValidator";

import * as Checkers from "../utils/checkers";

export class SchemaValidator extends AbstractValidator {
    private schemaName?: string;

    constructor(schema: ClassValidator.ValidationSchema, defaults?: UncertainObject) {
        super();
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
                forbidUnknownValues: true,
                validationError: {
                    target: false,
                    value: false
                }
            }).then((errors) => this.handleErrors(errors, groups));
    }

    private instantiateModel = (schema: ClassValidator.ValidationSchema, defaults?: UncertainObject): void => {
        Checkers.checkForSchema(schema);
        defaults !== undefined && Checkers.checkForDefaults(defaults);

        ClassValidator.registerSchema(schema);
        this.schemaName = schema.name;

        this.modelContainer = {
            instance: {},
            defaults
        }

        Object.keys(schema.properties).forEach((attribute) => {
            this.modelContainer.instance[attribute] = undefined;
        });

        defaults && this.dropToDefaults();
    }

}
