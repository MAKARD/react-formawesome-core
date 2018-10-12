import * as React from "react";

import { UncertainObject } from "../../Validators";
import * as Checkers from "../../Validators/utils/checkers";

import { FormContext, FormContextInterface } from "./FormContext";
import { FormProviderProps, FormProviderPropTypes } from "./FormProviderProps";

interface FormProviderState {
    loading: boolean;
    unparsedError?: any;
}

export class FormProvider extends React.Component<FormProviderProps, FormProviderState> {
    public static readonly propTypes = FormProviderPropTypes;

    public readonly state: FormProviderState = {
        loading: false
    };

    private registeredElements: UncertainObject = {};

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

            registerElement: this.registerElement,
            unregisterElement: this.unregisterElement,

            hasErrors: this.hasErrors,

            loading: this.state.loading,
            unparsedError: this.state.unparsedError,

            modelErrors: this.props.validator.modelErrors,
            modelValues: this.props.validator.modelValues
        };
    }

    protected registerElement = (attribute: string, element: any): boolean | never => {
        if (!element || typeof element.focus !== "function") {
            return false;
        }

        Checkers.checkForAttribute(
            this.props.validator.modelAttributes,
            attribute,
            this.props.validator.modelName
        );

        this.registeredElements[attribute] = element;
        this.forceUpdate();
        return true;
    }

    protected unregisterElement = (attribute: string): void => {
        delete this.registeredElements[attribute];
        this.forceUpdate();
    }

    protected handleSubmit = async (): Promise<void> | never => {
        this.setState({ loading: true, unparsedError: undefined });

        await this.handleValidate();

        if (this.hasErrors) {
            return this.setState({ loading: false });
        }

        try {
            await this.props.onSubmit(this.props.validator.modelValues);
        } catch (error) {
            this.setState({ loading: false });

            if (this.props.errorParser) {
                this.tryToParseError(error);
            } else {
                throw error;
            }
        }

        this.setState({ loading: false });
    }

    protected handleValidate = async (groups?: Array<string>): Promise<void> => {
        await this.props.validator.validate(groups);
        this.forceUpdate();

        this.hasErrors && this.focusOnError();
    }

    protected handleSetModelValue = (attribute: string, value: any): void => {
        this.props.validator.setModelValue(attribute, value);
        this.forceUpdate();
    }

    protected get hasErrors(): boolean {
        return !!Object.keys(this.props.validator.modelErrors).length
    }

    private focusOnError = () => {
        const element = this.registeredElements[Object.keys(this.props.validator.modelErrors)[0]];

        element && element.focus();
    }

    private tryToParseError = (error: any): void | never => {
        const parsedErrors = this.props.errorParser(error);

        if (Array.isArray(parsedErrors)) {
            this.props.validator.addErrors(parsedErrors);
            this.hasErrors && this.focusOnError();
            return;
        };

        if (this.props.handleUnparsedErrors) {
            return this.setState({ unparsedError: parsedErrors });
        } else {
            throw error;
        }
    }
}
