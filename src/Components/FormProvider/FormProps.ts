import * as PropTypes from "prop-types";

import { ValidatorPublicInterface, UncertainObject, AbstractValidator } from "../../Validators";

export interface FormProps {
    validator: ValidatorPublicInterface;
    onSubmit: (modelValues: UncertainObject) => Promise<void>;

    errorParser?: (error: any) => Array<{ attribute: string, details: string }>;
}

export const ValidatorPropTypes: PropTypes.ValidationMap<ValidatorPublicInterface> = {
    modelAttributes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    modelValues: PropTypes.object.isRequired,
    modelErrors: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,

    dropToDefaults: PropTypes.func.isRequired,
    setModelValue: PropTypes.func.isRequired,
    setDefaults: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired
};

export const FormPropTypes: PropTypes.ValidationMap<FormProps> = {
    validator: PropTypes.shape(ValidatorPropTypes).isRequired as any,
    onSubmit: PropTypes.func.isRequired,

    errorParser: PropTypes.func
};
