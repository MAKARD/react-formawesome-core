import * as PropTypes from "prop-types";

import { ValidatorPublicInterface, UncertainObject, ErrorInterface } from "../../Validators";

export interface FormProviderProps {
    validator: ValidatorPublicInterface;
    onSubmit: <T = UncertainObject>(modelValues: T) => Promise<void | { cancelUpdate?: boolean }>;

    errorParser?: (error: any) => Array<ErrorInterface> | any;
    handleUnparsedErrors?: boolean;

    beforeSubmit?: () => void;
    afterSubmit?: (hasErrors: boolean) => void;
}

export const ValidatorPropTypes: { [P in keyof ValidatorPublicInterface]: PropTypes.Validator<any> } = {
    modelAttributes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    modelValues: PropTypes.object.isRequired,
    modelErrors: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,

    dropToDefaults: PropTypes.func.isRequired,
    setModelValue: PropTypes.func.isRequired,
    setDefaults: PropTypes.func.isRequired,
    addErrors: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired
};

export const FormProviderPropTypes: PropTypes.ValidationMap<FormProviderProps> = {
    validator: PropTypes.shape(ValidatorPropTypes).isRequired as any,
    onSubmit: PropTypes.func.isRequired,

    errorParser: PropTypes.func,
    handleUnparsedErrors: PropTypes.bool,

    beforeSubmit: PropTypes.func,
    afterSubmit: PropTypes.func
};
