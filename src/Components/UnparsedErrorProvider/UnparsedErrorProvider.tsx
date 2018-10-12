import * as React from "react";

import { UnparsedErrorProviderProps, UnparsedErrorProviderPropTypes } from "./UnparsedErrorProviderProps";
import { FormContext, FormContextInterface } from "../FormProvider";

export class UnparsedErrorProvider extends React.Component<UnparsedErrorProviderProps> {
    public static readonly propTypes = UnparsedErrorProviderPropTypes;

    public render(): React.ReactNode {
        return (
            <FormContext.Consumer>
                {this.renderChildren}
            </FormContext.Consumer>
        );
    }

    protected renderChildren = (context: FormContextInterface): React.ReactNode => {
        if (!context.unparsedError) {
            return null;
        }

        return this.props.children(context.unparsedError);
    }

}
