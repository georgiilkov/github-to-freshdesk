import { z } from "zod";
import { GitHubUserSchema } from "./gitHubUser";

type ValidGitHubUserResult = {
  valid: true;
  data: z.infer<typeof GitHubUserSchema>;
};
type InvalidGitHubUserResult = {
  valid: false;
  errors: string[];
};
export type GitHubUserValidationResult = ValidGitHubUserResult | InvalidGitHubUserResult;