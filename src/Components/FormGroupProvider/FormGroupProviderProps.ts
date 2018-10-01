import * as PropTypes from "prop-types";

import { UncertainObject } from "../../Validators";

export enum Event {
    change = "change",
    focus = "focus",
    blur = "blur"
}

export interface FormGroupProviderProps {
    attribute: string;
    validateOn?: keyof typeof Event | ((values: UncertainObject, errors: UncertainObject) => boolean);
}

export const FormGroupProviderPropTypes: PropTypes.ValidationMap<FormGroupProviderProps> = {
    attribute: PropTypes.string.isRequired,
    validateOn: PropTypes.oneOfType([
        PropTypes.oneOf(Object.keys(Event).map((key) => Event[key])),
        PropTypes.func
    ])
};
