import { validateFreshdeskContact } from '../../src/utils/freshdeskContactValidator';

describe('Freshdesk Contact Validator', () => {
  describe('Correct Freshdesk contact', () => {
    it('should validate a correct Freshdesk contact with all fields', () => {
      const validContact = {
        name: 'Test User',
        email: 'test@example.com',
        unique_external_id: '12345',
        description: 'Test contact description'
      };

      const result = validateFreshdeskContact(validContact);

      expect(result.valid).toBe(true);
      if (!result.valid) return;

      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('Test User');
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.unique_external_id).toBe('12345');
      expect(result.data.description).toBe('Test contact description');
    });

    it('should validate a correct Freshdesk contact without optional fields', () => {
      const validContact = {
        name: 'Test User',
        unique_external_id: '12345'
      };

      const result = validateFreshdeskContact(validContact);

      expect(result.valid).toBe(true);
      if (!result.valid) return;

      expect(result.data.name).toBe('Test User');
      expect(result.data.email).toBeUndefined();
      expect(result.data.unique_external_id).toBe('12345');
      expect(result.data.description).toBeUndefined();
    });
  });

  describe('Incorrect Freshdesk contact', () => {
    it('should reject contact with missing required fields', () => {
      const invalidContact = {
        email: 'test@example.com',
        description: 'Test contact description'
      };

      const result = validateFreshdeskContact(invalidContact);

      expect(result.valid).toBe(false);
      if (result.valid) return;

      expect(result.errors).toBeDefined();
      expect(result.errors).toEqual(expect.arrayContaining(["name: Required", "unique_external_id: Required"]));
    });
    it('should reject contact with invalid fields', () => {
      const invalidContact = {
        name: '',
        email: 'testexample.com',
        unique_external_id: '',
        description: 1
      };
      const result = validateFreshdeskContact(invalidContact);

      expect(result.valid).toBe(false);
      if (result.valid) return;

      expect(result.errors).toBeDefined();
      expect(result.errors).toEqual(
        expect.arrayContaining(["name: Name must be at least 2 characters long",
          "email: Invalid email",
          "unique_external_id: unique_external_id must be at least 1 characters long",
          "description: Expected string, received number"]));
    });
  });

});