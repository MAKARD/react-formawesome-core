import { expect } from "chai";
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

import { FormProviderProps } from "../../src/Components/FormProvider/FormProviderProps";
import {
    ValidatorPublicInterface,
    FormContextInterface,
    ModelValidator,
    FormProvider,
    FormContext
} from "../../src";

import { ExampleModel, makeValid } from "../helpers/ExampleModel";

describe("<FormProvider />", () => {
    let wrapper: ReactWrapper<FormProviderProps, { unparsedError?: any }>;
    let validator: ValidatorPublicInterface;

    let context: FormContextInterface;

    beforeEach(() => {
        validator = new ModelValidator(ExampleModel, {
            name: "-",
            phone: "-",
            address: "-",
            surname: "-"
        });

        const onSubmit = async () => { throw new Error() };
        const render = (value) => {
            context = value;
            return <div />;
        };

        wrapper = mount(
            <FormProvider validator={validator} onSubmit={onSubmit}>
                <FormContext.Consumer>
                    {render}
                </FormContext.Consumer>
            </FormProvider>
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should validate", async () => {
        await context.onValidate();

        expect(context.modelErrors).to.not.be.empty;
    });

    it("Should set values", () => {
        context.setModelValue("name", "ValidName");

        expect(context.modelValues).to.have.property("name", "ValidName")
    });

    it("Should return error existing flag", async () => {
        expect(context.hasErrors).to.be.false;

        await context.onValidate();

        expect(context.hasErrors).to.be.true;
    });

    it("Should set loading flag while submit", async () => {
        expect(context.loading).to.be.false;

        context.onSubmit()
            .then(() => expect(context.loading).to.be.true)
            .catch(() => expect(context.loading).to.be.false);
    });

    it("Should call 'onSubmit' prop when validate successful", async () => {
        let submitCalled = false;
        wrapper.setProps({
            onSubmit: async () => { submitCalled = true }
        });

        makeValid(context);

        await context.onSubmit();
        expect(submitCalled).to.be.true;
    });

    it("Should call 'errorParser' if it passed, when 'onSubmit' throws error", async () => {
        wrapper.setProps({
            errorParser: () => [{
                attribute: "name",
                details: "test"
            }]
        });
        makeValid(context);

        await context.onSubmit();

        expect(context.modelErrors).to.deep.equal({ name: "test" });
    });

    it("Should throw error when 'onSubmit' throws error", async () => {
        makeValid(context);

        let throwed = false;
        await (new Promise((resolve) => {
            context.onSubmit().catch(() => resolve(throwed = true));
        }));

        expect(throwed).to.be.true;
    });

    it("Should do nothing on 'registerElement' if element is undefined or didn't have 'focus' method", () => {
        expect(context.registerElement("test", undefined)).to.be.false;
        expect(context.registerElement("test", {})).to.be.false;
    });

    it("Should throw error if passed attribute didn't exist in model", () => {
        expect(() => context.registerElement("test", { focus: () => undefined })).to.throw();
    });

    it("Should register element", () => {
        expect(context.registerElement("name", { focus: () => undefined })).to.be.true;
    });

    it("Should focus element on error if it registered", async () => {
        let focused = false;
        context.registerElement("name", { focus: () => focused = true });

        await context.onSubmit();

        expect(focused).to.be.true;
    });

    it("Should unregister element", async () => {
        let focused = false;
        context.registerElement("name", { focus: () => focused = true });

        await context.onSubmit();

        expect(focused).to.be.true;

        focused = false;
        context.unregisterElement("name");

        await context.onSubmit();

        expect(focused).to.be.false;
    });

    it("Should store unparsed error", async () => {
        wrapper.setProps({
            handleUnparsedErrors: true,
            errorParser: () => "test"
        });

        makeValid(context);

        await context.onSubmit();

        expect(wrapper.instance().state.unparsedError).to.equal("test");

        wrapper.setProps({
            handleUnparsedErrors: false,
            errorParser: () => "test"
        });

        let throwed = false;
        await (new Promise((resolve) => {
            context.onSubmit().catch(() => resolve(throwed = true));
        }));

        expect(throwed).to.be.true;
    });
});
