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

    it("Should validate on passed event", async () => {
        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, {
                validateOn: "change"
            }),
        } as any);

        await context.onChange("-");
        expect(context.error).to.equal("wrong name");

        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, {
                validateOn: "blur"
            }),
        } as any);
        context.onChange("ValidName");
        expect(context.error).to.equal("wrong name");
        await context.onBlur();
        expect(context.error).to.be.undefined;

        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, {
                validateOn: "focus"
            }),
        } as any);
        context.onChange("-");
        expect(context.error).to.be.undefined;
        await context.onFocus();
        expect(context.error).to.equal("wrong name");

    });

    it("Should validate on passet method", async () => {
        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, {
                validateOn: (values, error) => {
                    return values.name.length === 3;
                }
            }),
        } as any);

        await context.onChange("1");
        expect(context.error).to.be.undefined;

        await context.onChange("123");

        expect(context.error).to.equal("wrong name");
    });
});
