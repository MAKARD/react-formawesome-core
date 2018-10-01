import * as React from "react";

import { FormGroupProviderProps, FormGroupProviderPropTypes } from "./FormGroupProviderProps";
import { FormGroupContext, FormGroupContextInterface } from "./FormGroupContext";
import { FormContext, FormContextInterface } from "../FormProvider";

interface FormGroupProviderState {
    isFocused: boolean;
}

export class FormGroupProvider extends React.Component<FormGroupProviderProps, FormGroupProviderState> {
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
            onChange: this.handleChange(formContext),
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,

            isFocused: this.state.isFocused,

            error: formContext.modelErrors[this.props.attribute],
            value: formContext.modelValues[this.props.attribute]
        };
    }

    protected handleChange = (formContext: FormContextInterface) => (value: any): void => {
        formContext.setModelValue(this.props.attribute, value);
    }

    protected handleBlur = (): void => {
        this.setState({ isFocused: false });
    }

    protected handleFocus = (): void => {
        this.setState({ isFocused: true });
    }
}
