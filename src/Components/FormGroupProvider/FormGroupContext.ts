import * as React from "react";

export interface FormGroupContextInterface {
    error?: { details: string; attribute: string };
    value: any;

    isFocused: boolean;

    onChange: (value: any) => void | Promise<void>;
    onFocus: () => void | Promise<void>;
    onBlur: () => void | Promise<void>;
};

export const FormGroupContext = React.createContext<FormGroupContextInterface>({
    isFocused: false,
    value: ""
} as any);
