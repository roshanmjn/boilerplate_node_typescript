import { CustomHelpers } from "joi";

const objectId = (value: string, helpers: CustomHelpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid id column' });
    }
    return value;
};

const password = (value: string, helpers: CustomHelpers) => {
    if (value.length < 8) {
        return helpers.message({ custom: "password must be at least 8 characters" });
    }
    if (!value.match(/\d/)) {
        return helpers.message({ custom: "password must contain at least 1 number " });
    }
    if (!value.match(/[a-zA-Z]/)) {
        return helpers.message({ custom: "password must contain at least 1 letter" });
    }

    return value;
};

export { objectId, password };
