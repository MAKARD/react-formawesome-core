import { expect } from "chai";

import { NonAbstractValidator } from "../helpers/NonAbstractValidator";

describe("AbstractValidator", () => {
    let mockFields;

    beforeEach(() => {
        mockFields = {
            name: undefined,
            phone: undefined
        };
    });

    it("Should return model fields", () => {
        const modelValidator = new NonAbstractValidator(mockFields);
        expect(modelValidator.modelAttributes).to.deep.equal(Object.keys(mockFields));
    });

    it("Should set model defaults", () => {
        const modelValidator = new NonAbstractValidator(mockFields);
        expect(modelValidator.modelValues).to.deep.equal({});

        expect(() => modelValidator.setDefaults("" as any)).to.throw();

        const defaults = {
            name: "Test name",
        };

        modelValidator.setDefaults(defaults);
        modelValidator.dropToDefaults();

        expect(modelValidator.modelValues).to.deep.equal(defaults);
    });

    it("Should set model attribute value", () => {
        const modelValidator = new NonAbstractValidator(mockFields);

        modelValidator.setModelValue("name", "Test name");
        expect(modelValidator.modelValues).to.deep.equal({ name: "Test name" });

        expect(() => modelValidator.setModelValue("wrong attribute", "")).to.throw();
        expect(() => modelValidator.setModelValue("name", {})).to.throw();
    });

    it("Should clear model values", () => {
        const modelValidator = new NonAbstractValidator(mockFields);
        modelValidator.setModelValue("name", "Test name");

        expect(modelValidator.modelValues).to.deep.equal({ name: "Test name" });

        modelValidator.clear();

        expect(modelValidator.modelValues).to.deep.equal({});
    });

    it("Should handle errors", () => {
        const modelValidator = new NonAbstractValidator(mockFields);

        modelValidator.validate();

        modelValidator.handleErrorsMock([{
            property: "name",
            constraints: {
                test: "error"
            }
        }]);

        expect(modelValidator.modelErrors).to.deep.equal({ name: "error" });

        modelValidator.handleErrorsMock([
            {
                property: "name",
                constraints: { test: "error" }
            },
            {
                property: "phone",
                constraints: { test: "error" }
            }
        ], ["group1", "group2"]);

        expect(modelValidator.modelErrors).to.deep.equal({ name: "error", phone: "error" });
    });

    it("Should handle validation errors", async () => {
        const modelValidator = new NonAbstractValidator(mockFields);

        modelValidator.handleErrorsMock([{
            property: "name",
            constraints: ["test"]
        }]);

        expect(modelValidator.modelErrors).to.have.property("name", "test");

        modelValidator.clear();

        modelValidator.handleErrorsMock([{
            property: "name",
            constraints: ["test"]
        }], []);

        expect(modelValidator.modelErrors).to.not.have.property("name");


        modelValidator.handleErrorsMock([{
            property: "name",
            constraints: ["test"]
        }], ["name"]);

        expect(modelValidator.modelErrors).to.have.property("name", "test");
    });

    it("Should add validation error", () => {
        const modelValidator = new NonAbstractValidator(mockFields);

        modelValidator.addErrors([{ attribute: "name", details: "test" }]);

        expect(modelValidator.modelErrors).to.deep.equal({ name: "test" });

        expect(() => modelValidator.addErrors([{ attribute: "test", details: "" }])).to.throw();
        expect(() => modelValidator.addErrors([{ attribute: "name", details: true } as any])).to.throw();
    });
});
