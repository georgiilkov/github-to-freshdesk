import { FreshdeskContactSchema } from "../types/freshdeskContact";
import { FreshDeskContactValidationResult } from "../types/freshDeskContactValidationResult";
export function validateFreshdeskContact(data: unknown): FreshDeskContactValidationResult {
  const result = FreshdeskContactSchema.safeParse(data);

  if (result.success) {
    return {
      valid: true,
      data: result.data
    };
  } else {
    return {
      valid: false,
      errors: result.error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      )
    };
  }
} 