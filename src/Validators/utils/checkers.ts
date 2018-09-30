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

export function checkForGroup(errors, groups, modelName) {
    invariant(
        !errors.some(({ property }) => property === undefined),
        `Some of passed validation groups (${JSON.stringify(groups)}) does not defined in model/schema. ` +
        `Check '${modelName}' model/schema rules definition`
    );
}

export function checkForAttributeValue(modelAttributes, modelName, attribute, value) {
    invariant(
        modelAttributes.includes(attribute),
        `Attribute '${attribute}' does not exist in model/schema '${modelName}'`
    );

    invariant(
        typeof value !== "function" && typeof value !== "object",
        `Value '${value}' can't be setted to attribute ${attribute}`
    );
}
