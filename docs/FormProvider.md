# FormProvider

`FormProvider` component provide methods and states from validator to child components.

### Public interface

#### Props

Component takes several props:
 - `validator` - [validator](./Validators.md) instance. `Required`.
```ts
validator = new ModelValidator(ExampleModel);
validator = new SchemaValidator(ExampleSchema);
```
 - `onSubmit` - method that triggers on submitting. `Required`.
 
   `cancelUpdate` object key indicates that form should not update state after submit. `Optional`.
```ts
public onSubmit = async (modelValues: {[key: string]: string | boolean | number}): Promise<void | { cancelUpdate?: boolean }> => {
    await someAction(modelValues);
}
```
 - `errorParser` - method that triggers on unsuccessfully submitting. `Optional`.
```ts
public errorParser = (error: any): Array<{ attribute: string, details: string }> | any => {
    const parsedErrors = /*SOME ERROR PARSING CODE*/
    return parsedErrors; /*OR SOMETHING ANOTHER*/
}
```
 - `handleUnparsedErrors` - flag that specify should the `Form` to handle errors that `errorParser` returned when that errors cannot be applied to model. `Optional`. Needed for [UnparsedErrorProvider](./UnparsedErrorProvider.md).
```ts
public handleUnparsedErrors: boolean;
```
 - `beforeSubmit` - callback that triggers before submitting. `Optional`.
```ts
public beforeSubmit: () => void;
```
 - `afterSubmit` - callback that triggers after submitting. `Optional`.
```ts
public afterSubmit: (hasErrors: boolean) => void;
```

### Context

Component provide next context interface:
 - `onSubmit` - method that triggers on submitting.
```ts
public onSubmit: () => Promise<void>;
```
 - `onValidate` - method that triggers on validating.
```ts
public onValidate: (groups?: Array<string>): Promise<void>;
```
 - `setModelValue`- method for setting value for model/schema
```ts
public setModelValue: (attribute: string, value: {[key: string]: string | boolean | number}) => void;
```
 - `hasErrors` - flag that indicates errors existing.
```ts
public get hasErrors(): boolean;
```
 - `loading` - flag that indicates submit process.
```ts
public loading: boolean;
```
 - `modelErrors` - object that contains validation errors
```ts
public modelErrors: {
    [attributeName: string]: string;
}
```
 - `modelValues` - object that contains model/schema values
```ts
public modelValues: {
    [attributeName: string]: boolean | string | number;
}
```
 - `unparsedError` - contains unparsed error
```ts
public unparsedError?: any;
```
 - `unregisterElement` - method for unregister user interactive element
```ts
public unregisterElement: (attribute: string) => void;
```
 - `registerElement` - method for register user interactive element
```ts
public registerElement: (attribute: string, element: any) => boolean | never;
```
 - `registeredElements` - list of registered elemtns
```ts
public registeredElements: {[key: string]: { focus: () => void }}
```

### Usage

```tsx
import * as React from "react";
import { FormProvider, FormProviderProps } from "react-formawesome-core";

class MyFormWrapper extends React.Component<FormProviderProps> {
    public render(): React.ReactNode {
        return (
            <FormProvider {...this.props}>
                <form>
                    {this.props.children}
                </form>
            </FormProvider>
        );
    }
}
```
