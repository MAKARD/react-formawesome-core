# React Formawesome core (Under development)

[![Build Status](https://travis-ci.org/MAKARD/react-formawesome-core.svg?branch=master)](https://travis-ci.org/MAKARD/react-formawesome-core)
[![Code coverage](https://codecov.io/gh/MAKARD/react-formawesome-core/branch/master/graphs/badge.svg)](https://codecov.io/gh/MAKARD/react-formawesome-core/branch/master)

React wrapper for [class-validator](https://github.com/typestack/class-validator) library.

Core of [react-native-formawesome](https://github.com/MAKARD/react-native-formawesome) library.

[class-validator](https://github.com/typestack/class-validator) is not a peerDependency, so you can access it from this package:
```ts
import * as ClassValidator from "react-formawesome-core/class-validator";
```

# Installation

## Via NPM

```bash
 npm install --save-dev react-formawesome-core
```

# Content
 * Validators
    + [AbstractValidator](./docs/Validators.md#abstractvalidator)
    + [ModelValidator](./docs/Validators.md#modelvalidator)
    + [SchemaValidator](./docs/Validators.md#schemavalidator)
    + [Error cases](./docs/Validators.md#error-cases)
 * Providers
    + [FormProvider](./docs/FormProvider.md)
    + [FormGroupProvider](./docs/FormGroupProvider.md)
    + [UnparsedErrorProvider](./docs/UnparsedErrorProvider.md)
