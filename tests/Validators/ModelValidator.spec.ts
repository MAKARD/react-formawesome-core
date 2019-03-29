import { expect } from "chai";

import { ModelValidator } from "../../src";
import { ExampleModel } from "../helpers/ExampleModel";

describe("ModelValidator", () => {
    it("Should do throw errors on invalid props", () => {
        expect(() => new ModelValidator("" as any)).to.throw();
        expect(() => new ModelValidator(class Test { })).to.throw();
        expect(() => new ModelValidator(ExampleModel, {})).to.throw();
        expect(() => new ModelValidator(ExampleModel, "" as any)).to.throw();

        expect(() => new ModelValidator(ExampleModel)).to.not.throw();
        expect(() => new ModelValidator(ExampleModel, undefined, { skipAttributeCheck: true })).to.not.throw();
        expect(() => new ModelValidator(ExampleModel, undefined, { skipAttributeCheck: false })).to.not.throw();
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

        const modelValidator = new ModelValidator(ExampleModel, defaults);

        // #region Validate all
        await modelValidator.validate();
        expect(modelValidator.modelErrors).to.deep.equal(exepectedErors);
        modelValidator.dropToDefaults();
        // #endregion

        // #region Validate by each unique group
        await modelValidator.validate(["name"]);
        expect(modelValidator.modelErrors).to.deep.equal({
            name: exepectedErors.name
        });
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
});
