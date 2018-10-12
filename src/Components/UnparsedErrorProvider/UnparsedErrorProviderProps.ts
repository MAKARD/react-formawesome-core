import * as React from "react";
import * as PropTypes from "prop-types";

export interface UnparsedErrorProviderProps {
    children: (error: any) => React.ReactNode;
}

export const UnparsedErrorProviderPropTypes: PropTypes.ValidationMap<UnparsedErrorProviderProps> = {
    children: PropTypes.func.isRequired
};
