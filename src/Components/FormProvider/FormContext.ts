import * as React from "react";

import { UncertainObject } from "../../Validators";

export interface FormContextInterface {
    modelErrors: UncertainObject;
    modelValues: UncertainObject;

    loading: boolean;
    unparsedError?: any;

    hasErrors: boolean;

    onSubmit: () => Promise<void>;
    onValidate: (groups?: Array<string>) => Promise<void>;
    setModelValue: (attribute: string, value: any) => void;

    unregisterElement: (attribute: string) => void;
    registerElement: (attribute: string, element: any) => boolean | never;
}

export const FormContext = React.createContext<FormContextInterface>({
    modelErrors: {},
    modelValues: {},

    loading: false,
    hasErrors: false,
} as any);
