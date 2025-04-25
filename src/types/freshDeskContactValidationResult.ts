import { z } from "zod";
import { FreshdeskContactSchema } from "./freshdeskContact";

type ValidResult = {
    valid: true;
    data: z.infer<typeof FreshdeskContactSchema>;
  };
  
  type InvalidResult = {
    valid: false;
    errors: string[];
  };
  
  export type FreshDeskContactValidationResult = ValidResult | InvalidResult;