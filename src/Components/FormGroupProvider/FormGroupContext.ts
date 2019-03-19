import * as React from "react";

export interface FormGroupContextInterface {
    error?: string;
    value: any;

    isFocused: boolean;

    onChange: (value: any) => void | Promise<void>;
    onFocus: () => void | Promise<void>;
    onBlur: () => void | Promise<void>;

    registerElement: (element: any) => void;
    unregisterElement: () => void;
};

export const FormGroupContext = React.createContext<FormGroupContextInterface>({
    isFocused: false,
    value: ""
} as any);
