import { expect } from "chai";

import { ModelValidator } from "../src";
import { ExampleModel, ExampleModelFields } from "./ExampleModel";

describe("ModelValidator", () => {
    let modelValidator: ModelValidator;

    beforeEach(() => {
        modelValidator = new ModelValidator(ExampleModel);
    });

    afterEach(() => {
    });

    it("Should do throw errors on invalid props", () => {
        expect(() => new ModelValidator("" as any)).to.throw();
        expect(() => new ModelValidator(class Test { })).to.throw();
        expect(() => new ModelValidator(ExampleModel, {})).to.throw();
        expect(() => new ModelValidator(ExampleModel, "" as any)).to.throw();
    });

    it("Should return model fields", () => {
        expect(modelValidator.modelAttributes).to.deep.equal(Object.keys(ExampleModelFields));
    });

    it("Should drop model value to defaults", () => {
        expect(modelValidator.modelAttributes).to.deep.equal(Object.keys(ExampleModelFields));
    });
});
