import * as ClassValidator from "class-validator";

export enum ExampleModelFields {
    name = "name",
    phone = "phone",
    surname = "surname",
    address = "address"
}

export interface ExampleModelInterface {
    [ExampleModelFields.name]: string;
    [ExampleModelFields.phone]: string;
    [ExampleModelFields.surname]: string;
    [ExampleModelFields.address]: string;
}

export class ExampleModel implements ExampleModelInterface {
    @ClassValidator.MinLength(4, {
        groups: ["name", "name_phone", "common"],
        message: "wrong name"
    })
    @ClassValidator.IsAlpha({
        groups: ["name", "name_phone", "common"],
        message: "wrong name"
    })
    public name: string = undefined;

    @ClassValidator.MinLength(6, {
        groups: ["phone", "name_phone", "common"],
        message: "wrong phone"
    })
    @ClassValidator.IsNumberString({
        groups: ["phone", "name_phone", "common"],
        message: "wrong phone"
    })
    public phone: string = undefined;

    @ClassValidator.MinLength(4, {
        groups: ["surname", "surname_address", "common"],
        message: "wrong surname"
    })
    @ClassValidator.IsAlpha({
        groups: ["surname", "surname_address", "common"],
        message: "wrong surname"
    })
    public surname: string = undefined;

    @ClassValidator.MinLength(4, {
        groups: ["address", "surname_address", "common"],
        message: "wrong address"
    })
    @ClassValidator.IsAlphanumeric({
        groups: ["address", "surname_address", "common"],
        message: "wrong address"
    })
    public address: string = undefined;
}
