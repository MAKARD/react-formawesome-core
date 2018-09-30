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

import { ExampleModel } from "../helpers/ExampleModel";

describe("<FormProvider />", () => {
    let wrapper: ReactWrapper<FormProviderProps>;
    let validator: ValidatorPublicInterface;

    let context: FormContextInterface;

    beforeEach(() => {
        validator = new ModelValidator(ExampleModel, {
            name: "-",
            phone: "-",
            address: "-",
            surname: "-"
        });

        const onSubmit = async () => {
            throw new Error();
        }

        const render = (value) => {
            context = value;
            return <div />
        }

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
            .then(() => {
                expect(context.loading).to.be.true;
            })
            .catch(() => {
                expect(context.loading).to.be.false;
            });
    });

    it("Should call 'onSubmit' prop when validate successful", async () => {
        let submitCalled = false;

        wrapper.setProps({
            onSubmit: async () => {
                submitCalled = true;
            }
        });
        context.setModelValue("name", "ValidName");
        context.setModelValue("phone", "123456789");
        context.setModelValue("surname", "ValidSurname");
        context.setModelValue("address", "ValidAddress1");

        await context.onSubmit();
        expect(submitCalled).to.be.true;
    });

    it("Should call 'errorParser' if it passed, when 'onSubmit' throws error", async () => {
        wrapper.setProps({
            errorParser: () => {
                return [{
                    attribute: "name",
                    details: "test"
                }]
            }
        });

        context.setModelValue("name", "ValidName");
        context.setModelValue("phone", "123456789");
        context.setModelValue("surname", "ValidSurname");
        context.setModelValue("address", "ValidAddress1");

        await context.onSubmit();

        expect(context.modelErrors).to.deep.equal({ name: "test" });
    });

    it("Should throw error when 'onSubmit' throws error", async () => {
        context.setModelValue("name", "ValidName");
        context.setModelValue("phone", "123456789");
        context.setModelValue("surname", "ValidSurname");
        context.setModelValue("address", "ValidAddress1");

        let throwed = false;
        await (new Promise((resolve) => {
            context.onSubmit().catch(() => {
                throwed = true;
                resolve();
            });
        }));

        expect(throwed).to.be.true;
    });
});
