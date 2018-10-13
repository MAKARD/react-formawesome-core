import * as React from "react";

import { FormGroupProviderProps, FormGroupProviderPropTypes, Event } from "./FormGroupProviderProps";
import { FormGroupContext, FormGroupContextInterface } from "./FormGroupContext";
import { FormContext, FormContextInterface } from "../FormProvider";

interface FormGroupProviderState {
    isFocused: boolean;
}

export class FormGroupProvider extends React.PureComponent<FormGroupProviderProps, FormGroupProviderState> {
    public static readonly propTypes = FormGroupProviderPropTypes;

    public readonly state: FormGroupProviderState = {
        isFocused: false
    };

    public render(): React.ReactNode {
        return (
            <FormContext.Consumer>
                {this.renderChildren}
            </FormContext.Consumer>
        );
    }

    protected renderChildren = (formContext: FormContextInterface): React.ReactNode => {
        return (
            <FormGroupContext.Provider value={this.createChildContext(formContext)}>
                {this.props.children}
            </FormGroupContext.Provider>
        );
    }

    protected createChildContext = (formContext: FormContextInterface): FormGroupContextInterface => {
        return {
            unregisterElement: this.handleUnergisterElement(formContext),
            registerElement: this.handleRegisterElement(formContext),

            onChange: this.handleChange(formContext),
            onFocus: this.handleFocus(formContext),
            onBlur: this.handleBlur(formContext),

            isFocused: this.state.isFocused,

            error: formContext.modelErrors[this.props.attribute],
            value: formContext.modelValues[this.props.attribute],
        };
    }

    protected handleRegisterElement = (formContext: FormContextInterface) => (element: any): void => {
        formContext.registerElement(this.props.attribute, element);
    }

    protected handleUnergisterElement = (formContext: FormContextInterface) => (): void => {
        formContext.unregisterElement(this.props.attribute);
    }

    protected handleChange = (formContext: FormContextInterface) => (value: any): void | Promise<void> => {
        formContext.setModelValue(this.props.attribute, value);

        /**
         * model is updated but formContext is immutable
         * so formContex.modelValues[this.props.attribute]
         * is not updated in this scope.
         *
         * If value wouldn't setted, error will be thrown
         * and code below will be not executed
         */
        const manualUpdatedValues = {
            ...formContext.modelValues,
            [this.props.attribute]: value
        };

        if (this.shouldValidateOnChange) {
            return formContext.onValidate([this.props.attribute]);
        }

        if (this.shouldValidateOnMethod(manualUpdatedValues, formContext.modelErrors)) {
            return formContext.onValidate([this.props.attribute]);
        }
    }

    protected handleBlur = (formContext: FormContextInterface) => (): void | Promise<void> => {
        this.setState({ isFocused: false });

        if (this.shouldValidateOnBlur) {
            return formContext.onValidate([this.props.attribute]);
        }
    }

    protected handleFocus = (formContext: FormContextInterface) => (): void | Promise<void> => {
        this.setState({ isFocused: true });

        if (this.shouldValidateOnFocus) {
            return formContext.onValidate([this.props.attribute]);
        }
    }

    private get shouldValidateOnBlur(): boolean {
        if (Array.isArray(this.props.validateOn) && this.props.validateOn.includes(Event.blur)) {
            return true;
        }

        return this.props.validateOn === Event.blur;
    }

    private get shouldValidateOnFocus(): boolean {
        if (Array.isArray(this.props.validateOn) && this.props.validateOn.includes(Event.focus)) {
            return true;
        }

        return this.props.validateOn === Event.focus;
    }

    private get shouldValidateOnChange(): boolean {
        if (Array.isArray(this.props.validateOn) && this.props.validateOn.includes(Event.change)) {
            return true;
        }

        return this.props.validateOn === Event.change;
    }

    private shouldValidateOnMethod = (values, errors): boolean => {
        if (Array.isArray(this.props.validateOn)) {
            const conditionMethod: any = this.props.validateOn.find((event) => typeof event === "function");

            return conditionMethod && conditionMethod(values, errors);
        }

        return typeof this.props.validateOn === "function" && this.props.validateOn(values, errors);
    }
}
