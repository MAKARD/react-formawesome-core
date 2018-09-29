import { AbstractValidator } from "../src";

export class NonAbstractValidator extends AbstractValidator {
    constructor(mock) {
        super();

        this.modelContainer.instance = mock;
    }

    public get modelName() {
        return ""
    }

    public validate = async (groups?: Array<string>): Promise<void> => undefined;

    public handleErrorsMock = (errors, groups?) => {
        this.handleErrors(errors, groups);
    }
}
