import { AbstractValidator, ValidatorConfig } from "../../src";

export class NonAbstractValidator extends AbstractValidator {
    constructor(mock, config: ValidatorConfig = {}) {
        super();

        this.modelContainer.instance = mock;
        this.modelContainer.defaults = {};

        this.config = config;
    }

    public get modelName() {
        return ""
    }

    public validate = async (groups?: Array<string>): Promise<void> => undefined;

    public handleErrorsMock = (errors, groups?) => {
        this.handleErrors(errors, groups);
    }
}
