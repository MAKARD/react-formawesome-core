import * as PropTypes from "prop-types";

export interface FormGroupProviderProps {
    attribute: string;
}

export const FormGroupProviderPropTypes: PropTypes.ValidationMap<FormGroupProviderProps> = {
    attribute: PropTypes.string.isRequired,
};
