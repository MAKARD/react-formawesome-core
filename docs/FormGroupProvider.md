# FormGroupProvider

`FormGroupProvider` component provide methods and states for controlling user-interactive elements (input / select ..ets). Can control `exactly one` interactive element.

### Public interface

#### Props

Component takes several props:
 - `attribute` - name of model attribute that should be under control. `Required`.
```ts
public attribute: string;
```
 - `validateOn`