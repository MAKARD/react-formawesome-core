import * as ClassValidator from "class-validator";

import { ExampleModelInterface } from "./ExampleModel";

export class ExampleValidationModel implements ExampleModelInterface {
    constructor(props?) {
        if (props) {
            this.name = props.name;
            this.phone = props.phone;
        }
    }

    @ClassValidator.MinLength(2)
    @ClassValidator.IsDefined()
    public name: string = undefined;

    @ClassValidator.MinLength(3)
    @ClassValidator.IsDefined()
    public phone: string = undefined;
}
