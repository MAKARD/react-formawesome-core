import * as ClassValidator from "class-validator";

import { ExampleModel } from "./ExampleModel";

export class ExampleValidationModel extends ExampleModel {
    @ClassValidator.MinLength(4, {
        groups: ["name", "name_phone", "common"]
    })
    @ClassValidator.IsAlpha({
        groups: ["name", "name_phone", "common"]
    })
    public name: string = undefined;

    @ClassValidator.MinLength(6, {
        groups: ["phone", "name_phone", "common"]
    })
    @ClassValidator.IsNumberString({
        groups: ["phone", "name_phone", "common"]
    })
    public phone: string = undefined;

    @ClassValidator.MinLength(4, {
        groups: ["surname", "surname_address", "common"]
    })
    @ClassValidator.IsAlpha({
        groups: ["surname", "surname_address", "common"]
    })
    public surname: string = undefined;

    @ClassValidator.MinLength(4, {
        groups: ["address", "surname_address", "common"]
    })
    @ClassValidator.IsAlphanumeric({
        groups: ["address", "surname_address", "common"]
    })
    public address: string = undefined;
}
