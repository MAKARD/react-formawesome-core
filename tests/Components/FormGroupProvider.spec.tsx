import { expect } from "chai";
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ExampleModel } from "../helpers/ExampleModel";

import {
    FormGroupContextInterface,
    ValidatorPublicInterface,
    FormProviderProps,
    FormGroupProvider,
    FormGroupContext,
    ModelValidator,
    FormProvider,
    FormContext,
} from "../../src";

describe("<FormGroupProvider />", () => {
    let wrapper: ReactWrapper<FormProviderProps>;
    let validator: ValidatorPublicInterface;
    let context: FormGroupContextInterface;

    beforeEach(() => {
        validator = new ModelValidator(ExampleModel, {
            name: "qwerty",
            phone: "123456",
            address: "qwerty123",
            surname: "qwerty"
        });

        const onSubmit = async () => undefined;
        onSubmit();

        const render = (value) => {
            context = value;
            return <div />;
        }

        wrapper = mount(
            <FormProvider onSubmit={onSubmit} validator={validator}>
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
            children: React.cloneElement((wrapper.props() as any).children, { validateOn: "change" })
        } as any);

        await context.onChange("-");
        expect(context.error).to.equal("wrong name");

        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, { validateOn: "blur" })
        } as any);
        context.onChange("ValidName");
        expect(context.error).to.equal("wrong name");
        await context.onBlur();
        expect(context.error).to.be.undefined;

        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, { validateOn: "focus" })
        } as any);
        context.onChange("-");
        expect(context.error).to.be.undefined;
        await context.onFocus();
        expect(context.error).to.equal("wrong name");
    });

    it("Should validate on passet method", async () => {
        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, {
                validateOn: (values, error) => values.name.length === 3
            }),
        } as any);

        await context.onChange("1");
        expect(context.error).to.be.undefined;

        await context.onChange("123");

        expect(context.error).to.equal("wrong name");
    });

    it("Should validate on passed array of conditions", async () => {
        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, { validateOn: ["blur", "focus"] })
        } as any);

        context.onChange("-");
        await context.onFocus();
        expect(context.error).to.equal("wrong name");

        context.onChange("validName");
        await context.onBlur();
        expect(context.error).to.be.undefined;

        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, { validateOn: ["focus", "change"] })
        } as any);

        await context.onChange("-");
        expect(context.error).to.equal("wrong name");

        context.onChange("validName");
        await context.onFocus();
        expect(context.error).to.be.undefined;

        wrapper.setProps({
            children: React.cloneElement((wrapper.props() as any).children, {
                validateOn: ["focus", (v) => v.name.length > 1]
            })
        } as any);

        await context.onChange("-");
        expect(context.error).to.be.undefined;

        await context.onFocus();
        expect(context.error).to.equal("wrong name");

        await context.onChange("validName");
        expect(context.error).to.be.undefined;
    });

    it("Should register/unregister element", () => {
        let formContext;
        let registered = false
        let unregistered = false;
        const children = React.cloneElement((wrapper.props() as any).children);

        const render = (value) => {
            formContext = value;

            formContext.registerElement = () => registered = true;
            formContext.unregisterElement = () => unregistered = true;

            return children;
        }

        wrapper.setProps({
            children: (
                <FormContext.Consumer>
                    {render}
                </FormContext.Consumer>
            )
        } as any);

        context.registerElement("");
        context.unregisterElement();

        expect(registered).to.be.true;
        expect(unregistered).to.be.true;
    });
});
