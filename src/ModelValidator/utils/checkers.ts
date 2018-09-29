const invariant = require("invariant");

export function checkForDefaults(defaults) {
    invariant(typeof defaults === "object", "'defaults' argument should be an object");
    invariant(
        Object.keys(defaults).length,
        "Defaults does not have any fields." +
        "Remove 'defaults' argument instead passing empty object"
    );
}

export function checkForModel(Model) {
    invariant(typeof Model === "function", "You should pass valid model class");
}

export function checkForInstance(instance) {
    invariant(
        Object.keys(instance).length,
        "Model class does not have any fields. Did you forget set the values?"
    );
}
