import { validateGitHubUserData } from '../../src/utils/gitHubUserDataValidator';

describe('GitHub User Data Validator', () => {
    describe('Valid GitHub user data', () => {
        it('should validate complete GitHub user data', () => {
            const validUser = {
                login: 'testlogin',
                id: 583231,
                name: 'Great Name',
                email: 'test@github.com'
            };

            const result = validateGitHubUserData(validUser);

            expect(result.valid).toBe(true);
            if (!result.valid) return;

            expect(result.data).toBeDefined();
            expect(result.data.login).toBe('testlogin');
            expect(result.data.id).toBe(583231);
            expect(result.data.name).toBe('Great Name');
            expect(result.data.email).toBe('test@github.com');
        });

        it('should validate GitHub user data with nullable fields set to null', () => {
            const validUserWithNulls = {
                login: 'minimalist',
                id: 12345,
                name: null,
                email: null
            };

            const result = validateGitHubUserData(validUserWithNulls);

            expect(result.valid).toBe(true);
            if (!result.valid) return;

            expect(result.data).toBeDefined();
            expect(result.data.login).toBe('minimalist');
            expect(result.data.id).toBe(12345);
            expect(result.data.name).toBeNull();
            expect(result.data.email).toBeNull();
        });
    });

    describe('Invalid GitHub user data', () => {
        it('should reject data with missing required fields', () => {
            const missingRequiredFields = {
                name: 'Missing Fields User',
                email: 'missing@example.com'
            };

            const result = validateGitHubUserData(missingRequiredFields);

            expect(result.valid).toBe(false);
            if (result.valid) return;

            expect(result.errors).toBeDefined();
            expect(result.errors).toEqual(
                expect.arrayContaining(["login: Required", "id: Required"])
            );
        });

        it('should reject data with invalid field types', () => {
            const invalidTypes = {
                login: 123,
                id: '12345',
                name: 42,
                email: true
            };

            const result = validateGitHubUserData(invalidTypes);

            expect(result.valid).toBe(false);
            if (result.valid) return;

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors).toEqual(
                expect.arrayContaining(["login: Expected string, received number",
                    "id: Expected number, received string",
                    "name: Expected string, received number",
                    "email: Expected string, received boolean"])
            );
        });

        it('should reject data with invalid login', () => {
            const invalidTypes = {
                login: '',
                id: 583231,
                name: 'Great Name',
                email: 'test@github.com',
            };

            const result = validateGitHubUserData(invalidTypes);

            expect(result.valid).toBe(false);
            if (result.valid) return;

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors).toEqual(
                expect.arrayContaining(["login: Login must be at least 2 characters long"])
            );
        });

        it('should reject data with invalid name', () => {
            const invalidTypes = {
                login: 'testlogin',
                id: 583231,
                name: '',
                email: 'test@github.com'
            };

            const result = validateGitHubUserData(invalidTypes);

            expect(result.valid).toBe(false);
            if (result.valid) return;

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors).toEqual(
                expect.arrayContaining(["name: Name must be at least 2 characters long"])
            );
        });

        it('should reject data with invalid email', () => {
            const invalidTypes = {
                login: 'testlogin',
                id: 583231,
                name: 'Great Name',
                email: 'test'
            };

            const result = validateGitHubUserData(invalidTypes);

            expect(result.valid).toBe(false);
            if (result.valid) return;

            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors).toEqual(
                expect.arrayContaining(["email: Invalid email"])
            );
        });


    });
});