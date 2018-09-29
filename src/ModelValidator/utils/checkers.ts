const invariant = require("invariant");

export function checkForDefaults(defaults) {
    invariant(typeof defaults === "object", "'defaults' argument should be an object");
    invariant(
        Object.keys(defaults).length,
        "Defaults does not have any values." +
        "Remove 'defaults' argument instead passing empty object"
    );
}

export function checkForModel(Model) {
    invariant(typeof Model === "function", "You should pass valid model class");
}

export function checkForInstance(instance) {
    invariant(
        Object.keys(instance).length,
        "Model class does not have any attributes. Did you forget set the values?"
    );

    if (instance.groups !== undefined) {
        invariant(
            typeof instance.groups === "object",
            "Model class has invalid 'groups' attribute." +
            "'groups' attribute should be an object or an getter, that returns object"
        );
        invariant(
            Object.keys(instance.groups).length,
            "Model class attribute 'groups' is does not have any values." +
            "Remove 'groups' attribute instead initializing empty object"
        );
    }
}
