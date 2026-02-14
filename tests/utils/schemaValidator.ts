// tests/utils/schemaValidator.ts
import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({ allErrors: true });

export function validateSchema<T>(data: unknown, schema: JSONSchemaType<T>) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    return { valid: Boolean(valid), errors: validate.errors };
}
