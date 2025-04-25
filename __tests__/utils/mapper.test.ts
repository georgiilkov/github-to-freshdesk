import { mapGitHubUserToFreshdeskContact } from '../../src/utils/mapper';
import { GitHubUser } from '../../src/types/gitHubUser';

describe('GitHub to Freshdesk mapper', () => {
    it('should map complete GitHub user to Freshdesk contact', () => {
        const githubUser: GitHubUser = {
            login: 'some-login',
            id: 583231,
            name: 'Some Name',
            email: 'email@github.com'
        };

        const freshdeskContact = mapGitHubUserToFreshdeskContact(githubUser);

        expect(freshdeskContact.name).toBe('Some Name');
        expect(freshdeskContact.unique_external_id).toBe('583231');
        expect(freshdeskContact.description).toBe('A Freshdesk Contact from GitHub user some-login');
        expect(freshdeskContact.email).toBe('email@github.com');
    });

    it('should fallback to login when name is null', () => {
        const githubUser: GitHubUser = {
            login: 'anonymous',
            id: 12345,
            name: null,
            email: 'anon@example.com'
        };

        const freshdeskContact = mapGitHubUserToFreshdeskContact(githubUser);
        expect(freshdeskContact.name).toBe('anonymous');
        expect(freshdeskContact).toEqual({
            name: 'anonymous',
            email: 'anon@example.com',
            unique_external_id: '12345',
            description: 'A Freshdesk Contact from GitHub user anonymous'
        });
    });

    it('should not add email field when it is null', () => {
        const githubUser: GitHubUser = {
            login: 'some-login',
            id: 583231,
            name: 'Some Name',
            email: null
        };

        const freshdeskContact = mapGitHubUserToFreshdeskContact(githubUser);

        expect(freshdeskContact.email).toBeUndefined();
        expect(freshdeskContact).toEqual({
            name: 'Some Name',
            unique_external_id: '583231',
            description: 'A Freshdesk Contact from GitHub user some-login'
        });

    });

}); 