import * as PropTypes from "prop-types";

import { UncertainObject } from "../../Validators";

export enum Event {
    change = "change",
    focus = "focus",
    blur = "blur"
}

type ValidateOn = keyof typeof Event | ((values: UncertainObject, errors: UncertainObject) => boolean);

export interface FormGroupProviderProps {
    attribute: string;
    validateOn?: ValidateOn | Array<ValidateOn>;
}

export const FormGroupProviderPropTypes: PropTypes.ValidationMap<FormGroupProviderProps> = {
    attribute: PropTypes.string.isRequired,
    validateOn: PropTypes.oneOfType([
        PropTypes.oneOf(Object.keys(Event).map((key) => Event[key])),
        PropTypes.func,
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.oneOf(Object.keys(Event).map((key) => Event[key])),
                PropTypes.func
            ])
        )
    ])
};
