import { expect } from "chai";

import { ModelValidator } from "../src";
import { ExampleModel, ExampleModelFields } from "./ExampleModel";
import { ExampleValidationModel } from "./ExampleValidationModel";

describe("ModelValidator", () => {
    it("Should do throw errors on invalid props", () => {
        expect(() => new ModelValidator("" as any)).to.throw();
        expect(() => new ModelValidator(class Test { })).to.throw();
        expect(() => new ModelValidator(ExampleModel, {})).to.throw();
        expect(() => new ModelValidator(ExampleModel, "" as any)).to.throw();
    });

    it("Should return model fields", () => {
        const modelValidator = new ModelValidator(ExampleModel);
        expect(modelValidator.modelAttributes).to.deep.equal(Object.keys(ExampleModelFields));
    });

    it("Should set model defaults", () => {
        const modelValidator = new ModelValidator(ExampleModel);

        expect(modelValidator.modelValues).to.deep.equal({});

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

    it("Should set model attribute value", () => {
        const modelValidator = new ModelValidator(ExampleModel);

        modelValidator.setModelValue("name", "Test name");
        expect(modelValidator.modelValues).to.deep.equal({name: "Test name"});

        expect(() => modelValidator.setModelValue("wrong attribute", "")).to.throw();
        expect(() => modelValidator.setModelValue("name", {})).to.throw();
    });

    it("Should validate attributes according to groups", async () => {
        const defaults = {
            surname: "-",
            address: "-",
            phone: "-",
            name: "-"
        };

        const exepectedErors = {
            surname: "wrong surname",
            address: "wrong address",
            phone: "wrong phone",
            name: "wrong name"
        };

        const modelValidator = new ModelValidator(ExampleValidationModel, defaults);

        // #region Validate all
        await modelValidator.validate();
        expect(modelValidator.modelErrors).to.deep.equal(exepectedErors);
        modelValidator.dropToDefaults();
        // #endregion

        // #region Validate by each unique group
        await modelValidator.validate(["name"]);
        expect(modelValidator.modelErrors).to.deep.equal({ name: exepectedErors.name });
        await modelValidator.validate(["phone"]);
        expect(modelValidator.modelErrors).to.deep.equal({
            name: exepectedErors.name,
            phone: exepectedErors.phone,
        });
        await modelValidator.validate(["address"]);
        expect(modelValidator.modelErrors).to.deep.equal({
            name: exepectedErors.name,
            phone: exepectedErors.phone,
            address: exepectedErors.address,
        });
        await modelValidator.validate(["surname"]);
        expect(modelValidator.modelErrors).to.deep.equal(exepectedErors);
        modelValidator.dropToDefaults();
        // #endregion

        // #region Validate by pair group
        await modelValidator.validate(["name_phone"]);
        expect(modelValidator.modelErrors).to.deep.equal({
            name: exepectedErors.name,
            phone: exepectedErors.phone,
        });
        await modelValidator.validate(["surname_address"]);
        expect(modelValidator.modelErrors).to.deep.equal(exepectedErors);
        modelValidator.dropToDefaults();
        // #endregion

        // #region Validate by common group
        await modelValidator.validate(["common"]);
        expect(modelValidator.modelErrors).to.deep.equal(exepectedErors);
        modelValidator.dropToDefaults();
        // #endregion

        await modelValidator.validate();
        modelValidator.setModelValue("name", "ValidName");
        delete exepectedErors.name;
        await modelValidator.validate();
        expect(modelValidator.modelErrors).to.deep.equal(exepectedErors);
    });

    it("Should throw error if passed validation group does not defined", async () => {
        const modelValidator = new ModelValidator(ExampleValidationModel);

        let error = false;
        await (new Promise((resolve) => {
            modelValidator.validate(["Unknown group"])
                .catch(() => resolve(error = true));
        }));

        expect(error).to.be.true;
    });
});
