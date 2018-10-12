import { expect } from "chai";
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

import { ExampleModel, makeValid } from "../helpers/ExampleModel";

import {
    ValidatorPublicInterface,
    UnparsedErrorProvider,
    FormContextInterface,
    FormProviderProps,
    ModelValidator,
    FormProvider,
    FormContext,
} from "../../src";

describe("<UnparsedErrorProvider />", () => {
    let wrapper: ReactWrapper<FormProviderProps>;
    let validator: ValidatorPublicInterface;
    let context: FormContextInterface;

    let errorRendered = false;

    beforeEach(() => {
        validator = new ModelValidator(ExampleModel, {
            name: "qwerty",
            phone: "123456",
            address: "qwerty123",
            surname: "qwerty"
        });

        const onSubmit = () => { throw new Error("")};

        const render = (value) => {
            context = value;

            const renderError = () => {
                errorRendered = true;

                return <div />;
            }

            return (
                <UnparsedErrorProvider>
                    {renderError}
                </UnparsedErrorProvider>
            );
        };

        wrapper = mount(
            <FormProvider onSubmit={onSubmit} validator={validator}>
                <FormContext.Consumer>
                    {render}
                </FormContext.Consumer>
            </FormProvider>
        );
    });

    afterEach(() => {
        wrapper.unmount();
        errorRendered = false;
    });

    it("Should should not render error if it didn't exist", () => {
        expect(errorRendered).to.be.false;
    });

    it("Should should render error if it exist", async () => {
        wrapper.setProps({
            handleUnparsedErrors: true,
            errorParser: () => "test"
        });

        makeValid(context);

        await context.onSubmit();

        expect(errorRendered).to.be.true;
    });
});
