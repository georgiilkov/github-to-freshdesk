import { GitHubUserSchema } from "../types/gitHubUser";
import { GitHubUserValidationResult } from "../types/gitHubUserValidationResult";

export function validateGitHubUserData(data: unknown): GitHubUserValidationResult {
  const result = GitHubUserSchema.safeParse(data);

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