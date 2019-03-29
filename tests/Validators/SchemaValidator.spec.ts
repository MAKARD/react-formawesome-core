import { expect } from "chai";

import { SchemaValidator } from "../../src";
import { ExampleSchema } from "../helpers/ExampleSchema";

describe("SchemaValidator", () => {
    it("Should do throw errors on invalid props", () => {
        expect(() => new SchemaValidator("" as any)).to.throw();
        expect(() => new SchemaValidator({} as any)).to.throw();

        expect(() => new SchemaValidator(ExampleSchema, {})).to.throw();
        expect(() => new SchemaValidator(ExampleSchema, "" as any)).to.throw();

        expect(() => new SchemaValidator(ExampleSchema)).to.not.throw();
        expect(() => new SchemaValidator(ExampleSchema, undefined, { skipAttributeCheck: true })).to.not.throw();
        expect(() => new SchemaValidator(ExampleSchema, undefined, { skipAttributeCheck: false })).to.not.throw();
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

        const modelValidator = new SchemaValidator(ExampleSchema, defaults);

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
