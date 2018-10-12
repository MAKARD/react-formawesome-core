# FormGroupProvider

`FormGroupProvider` component is provide methods and states for controlling user-interactive elements (input / select ..ets). Can control `exactly one` interactive element.

### Public interface

#### Props

Component takes several props:
 - `attribute` - name of model attribute that should be under control. `Required`.
```ts
public attribute: string;
```
 - `validateOn` - prop that define when validate value. `Optional`.
```ts
public validateOn: "change";
public validateOn: "focus";
public validateOn: "blur";
public validateOn: (modelValues, modelErrors) => boolean;
```

### Context

Component provide next context:
 - `error` - contains validation error message.
```ts
public error?: string;
```
 - `value` - contains attribute value.
```ts
public value: string | boolean | number;
```
 - `isFocused` - flag that indicates element focus state.
```ts
public isFocused: boolean;
```
 - `onChange` - method that triggers when value in element was changed. Return promise if `validateOn` prop is `change` or `function`
```ts
public onChange: (value: string | boolean | number) => void | Promise<void>;
```
 - `onFocus` - method that triggers when element is focused. Return promise if `validateOn` prop is `focus`.
```ts
public onFocus: () => void | Promise<void>;
```
 - `onBlur` - method that triggers when element is lost focus. Return promise `validateOn` prop is `blur`.
```ts
public onBlur: () => void | Promise<void>;
```

### Usage

```tsx
import * as React from "react";
import { FormGroupProvider, FormGroupProviderProps } from "react-formawesome-core";

class MyFormGroupWrapper extends React.Component<FormGroupProviderProps> {
    public render(): React.ReactNode {
        return (
            <FormGroupProvider {...this.props}>
                <div>
                    {this.props.children}
                </div>
            </FormGroupProvider>
        );
    }
}
```
