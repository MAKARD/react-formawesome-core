# UnparsedErrorProvider

`UnparsedErrorProvider` component is provide methods and states from validator to child components.

### Public interface

#### Props

Component takes only one prop:
 - `children` - must be a function, that takes as argument unparsed error. `Required`.
```ts
public children: (error: any) => React.ReactNode;
```

*If error doesn't exist, children will not rendered*

### Usage

```tsx
import * as React from "react";
import { UnparsedErrorProvider } from "react-formawesome-core";

class MyUnparsedErrorWrapper extends React.Component {
    public render(): React.ReactNode {
        return (
            <UnparsedErrorProvider>
                {(error: any) => <span>{error.message}</span>}
            </UnparsedErrorProvider>
        );
    }
}
```
