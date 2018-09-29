export enum ExampleModelFields {
    name = "name",
    phone = "phone"
}

export interface ExampleModelInterface {
    [ExampleModelFields.name]: string;
    [ExampleModelFields.phone]: string;
}

export class ExampleModel implements ExampleModelInterface {
    constructor(props?) {
        if (props) {
            this.name = props.name;
            this.phone = props.phone;
        }
    }

    public name: string = undefined;

    public phone: string = undefined;
}
