const invariant = require("invariant");

export function checkForDefaults(defaults, attributes) {
    invariant(typeof defaults === "object", "'defaults' argument should be an object");
    invariant(
        Object.keys(defaults).length,
        "Defaults does not have any values." +
        "Remove 'defaults' argument instead passing empty object"
    );
    Object.keys(defaults).forEach((key) =>
        invariant(attributes.includes(key), `Attribute '${key}' passed with defaults does not exist in model/schema`)
    );
}

export function checkForModel(Model) {
    invariant(typeof Model === "function", "You should pass valid model class");
}

export function checkForSchema(schema) {
    invariant(
        typeof schema === "object"
        && typeof schema.name === "string"
        && typeof schema.properties === "object",
        "You should pass valid schema object"
    );
}

export function checkForInstance(instance) {
    invariant(
        Object.keys(instance).length,
        "Model/schema does not have any attributes. Did you forget set the values?"
    );
}

export function checkForAttribute(modelAttributes, attribute, modelName, config: any = {}) {
    if (config.skipAttributeCheck) {
        return modelAttributes.includes(attribute);
    }

    invariant(
        modelAttributes.includes(attribute),
        `Attribute '${attribute}' does not exist in model/schema '${modelName}'`
    );

    return true;
}

export function checkForConfig(config) {
    invariant(
        typeof config === "object",
        "You should pass valid config object"
    );
}

export function checkForValue(attribute, value) {
    invariant(
        typeof value !== "function" && typeof value !== "object",
        `Value '${value}' can't be setted to attribute ${attribute}`
    );
}

export function checkForDetails(details) {
    invariant(
        typeof details === "string",
        "'details' value should be a string"
    );
}
