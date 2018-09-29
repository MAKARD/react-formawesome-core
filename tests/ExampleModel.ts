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
    public name: string = undefined;

    public phone: string = undefined;

    public surname: string = undefined;

    public address: string = undefined;
}
