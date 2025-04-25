import { GitHubUser } from '../types/gitHubUser';
import { FreshdeskContact } from '../types/freshdeskContact';

export function mapGitHubUserToFreshdeskContact(githubUser: GitHubUser): FreshdeskContact {
  const contact: FreshdeskContact = {
    name: githubUser.name || githubUser.login,
    unique_external_id: githubUser.id.toString(),
    description: `A Freshdesk Contact from GitHub user ${githubUser.login}`,
    ...(githubUser.email && { email: githubUser.email })
  };

  return contact;
}
