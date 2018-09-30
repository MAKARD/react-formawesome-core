import * as React from "react";

import { FormContext, FormContextInterface } from "./FormContext";
import { FormProps, FormPropTypes } from "./FormProps";

interface FormProviderState {
    loading: boolean;
}

export class FormProvider extends React.Component<FormProps, FormProviderState> {
    public static readonly propTypes = FormPropTypes;

    public readonly state: FormProviderState = {
        loading: false
    };

    public render(): React.ReactNode {
        return (
            <FormContext.Provider value={this.childContext}>
                {this.props.children}
            </FormContext.Provider>
        );
    }

    protected get childContext(): FormContextInterface {
        return {
            onSubmit: this.handleSubmit,
            onValidate: this.handleValidate,
            setModelValue: this.handleSetModelValue,

            hasErrors: this.hasErors,
            loading: this.state.loading,

            modelErrors: this.props.validator.modelErrors,
            modelValues: this.props.validator.modelValues
        };
    }

    protected handleSubmit = async (): Promise<void> => {
        this.setState({ loading: true });

        await this.props.validator.validate();

        if (this.hasErors) {
            return this.setState({ loading: false });
        }

        try {
            await this.props.onSubmit(this.props.validator.modelValues);
        } catch (error) {
            // todo: parse error;
            this.setState({ loading: false });
            throw error;
        }

        this.setState({ loading: false });
    }

    protected handleValidate = async (groups?: Array<string>): Promise<void> => {
        await this.props.validator.validate(groups);
        this.forceUpdate();
    }

    protected handleSetModelValue = (attribute: string, value: any): void => {
        this.props.validator.setModelValue(attribute, value);
        this.forceUpdate();
    }

    protected get hasErors(): boolean {
        return !!Object.keys(this.props.validator.modelErrors).length
    }
}
