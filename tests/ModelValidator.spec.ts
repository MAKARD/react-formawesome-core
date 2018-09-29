import { expect } from "chai";

import { ModelValidator } from "../src";
import { ExampleModel, ExampleModelFields } from "./ExampleModel";
import { ExampleValidationModel } from "./ExampleValidationModel";

describe("ModelValidator", () => {
    it("Should do throw errors on invalid props", () => {
        // check instance
        expect(() => new ModelValidator("" as any)).to.throw();
        expect(() => new ModelValidator(class Test { })).to.throw();

        // check defaults
        expect(() => new ModelValidator(ExampleModel, {})).to.throw();
        expect(() => new ModelValidator(ExampleModel, "" as any)).to.throw();
    });

    it("Should return model fields", () => {
        const modelValidator = new ModelValidator(ExampleModel);
        expect(modelValidator.modelAttributes).to.deep.equal(Object.keys(ExampleModelFields));
    });

    it("Should set model defaults", () => {
        let modelValidator = new ModelValidator(ExampleModel);

        expect(modelValidator.modelValues).to.deep.equal({
            name: undefined,
            phone: undefined
        });

        const defaults = {
            name: "Test name",
            phone: "Test phone"
        };

        expect(() => modelValidator.setDefaults("" as any)).to.throw();

        modelValidator.setDefaults(defaults);
        modelValidator.dropToDefaults();

        expect(modelValidator.modelValues).to.deep.equal(defaults);
    });

    it("Should drop model values to defaults", () => {
        const defaults = {
            name: "Test name",
            phone: "Test phone"
        };

        const modelValidator = new ModelValidator(ExampleModel, defaults);

        expect(modelValidator.modelValues).to.deep.equal(defaults);

        defaults.name = "New name";
        defaults.phone = "New phone";

        modelValidator.setDefaults(defaults);

        modelValidator.dropToDefaults();

        expect(modelValidator.modelValues).to.deep.equal(defaults);
    });

    it("Should", async () => {
        const modelValidator = new ModelValidator(ExampleValidationModel, { phone: "2" });
        // await modelValidator.validate(["phone2"]);
        // await modelValidator.validate(["phone"]);

        // await modelValidator.validate(["name"]);
        await modelValidator.validate();
        console.log(modelValidator.modelErrors)
        // await modelValidator.validate(["name"]);
        // await modelValidator.validate(["phone"]);
    });
});
