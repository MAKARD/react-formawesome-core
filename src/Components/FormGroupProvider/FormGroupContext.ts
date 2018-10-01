import * as React from "react";

export interface FormGroupContextInterface {
    error?: { details: string; attribute: string };
    value: any;

    isFocused: boolean;

    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
};

export const FormGroupContext = React.createContext<FormGroupContextInterface>({
    isFocused: false,
    value: ""
} as any);
