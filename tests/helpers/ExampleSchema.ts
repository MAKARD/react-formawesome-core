import * as ClassValidator from "class-validator";

export const ExampleSchema: ClassValidator.ValidationSchema = {
    name: "ExampleSchema",
    properties: {
        name: [
            {
                type: "minLength",
                constraints: [4],
                message: "wrong name",
                groups: ["name", "name_phone", "common"]
            },
            {
                type: "isAlpha",
                message: "wrong name",
                groups: ["name", "name_phone", "common"]
            }
        ],
        phone: [
            {
                type: "minLength",
                constraints: [6],
                message: "wrong phone",
                groups: ["phone", "name_phone", "common"]
            },
            {
                type: "isNumberString",
                message: "wrong phone",
                groups: ["phone", "name_phone", "common"]
            }
        ],
        surname: [
            {
                type: "minLength",
                constraints: [6],
                message: "wrong surname",
                groups: ["surname", "surname_address", "common"]
            },
            {
                type: "isAlpha",
                message: "wrong surname",
                groups: ["surname", "surname_address", "common"]
            }
        ],
        address: [
            {
                type: "minLength",
                constraints: [4],
                message: "wrong address",
                groups: ["address", "surname_address", "common"]
            },
            {
                type: "isAlpha",
                message: "wrong address",
                groups: ["address", "surname_address", "common"]
            }
        ]
    }
};
