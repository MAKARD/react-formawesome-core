import { expect } from "chai";
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

import { FormGroupProviderProps } from "../../src/Components/FormGroupProvider/FormGroupProviderProps";
import { ExampleModel } from "../helpers/ExampleModel";

import {
    FormGroupContextInterface,
    ValidatorPublicInterface,
    FormGroupProvider,
    FormGroupContext,
    ModelValidator,
    FormProvider
} from "../../src";

describe("<FormGroupProvider />", () => {
    let wrapper: ReactWrapper<FormGroupProviderProps>;
    let validator: ValidatorPublicInterface;
    let context: FormGroupContextInterface;

    beforeEach(() => {
        validator = new ModelValidator(ExampleModel, {
            name: "-",
            phone: "-",
            address: "-",
            surname: "-"
        });

        const onSubmit = async () => undefined;
        onSubmit();

        const render = (value) => {
            context = value;
            return <div />;
        }

        wrapper = mount(
            <FormProvider validator={validator} onSubmit={onSubmit}>
                <FormGroupProvider attribute="name">
                    <FormGroupContext.Consumer>
                        {render}
                    </FormGroupContext.Consumer>
                </FormGroupProvider>
            </FormProvider>
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should set model value on change", () => {
        context.onChange("test");

        expect(validator.modelValues.name).to.equal("test");
    });

    it("Should set focus on focus", () => {
        context.onFocus();

        expect(context.isFocused).to.be.true;
    });

    it("Should remove focus on blur", () => {
        context.onFocus();
        expect(context.isFocused).to.be.true;

        context.onBlur();

        expect(context.isFocused).to.be.false;
    });
});
