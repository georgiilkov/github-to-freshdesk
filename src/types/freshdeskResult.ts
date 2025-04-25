import { FreshdeskContact } from "./freshdeskContact";

export interface FreshdeskResult {
  action: 'created' | 'updated';
  contact: FreshdeskContact & { id: number };
} 