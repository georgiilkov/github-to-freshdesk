#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { getGitHubUser } from './services/githubService';
import { validateGitHubUserData } from './utils/gitHubUserDataValidator';
import { mapGitHubUserToFreshdeskContact } from './utils/mapper';
import { createOrUpdateFreshdeskContact } from './services/freshdeskService';

dotenv.config();

const program = new Command();

program
  .name('github-to-freshdesk')
  .description('Sync GitHub users to Freshdesk contacts')
  .version('1.0.0')
  .requiredOption('-u, --username <username>', 'GitHub username')
  .requiredOption('-d, --subdomain <subdomain>', 'Freshdesk subdomain')
  .parse(process.argv);

const options = program.opts();

async function main(): Promise<void> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }
    if (!process.env.FRESHDESK_TOKEN) {
      throw new Error('FRESHDESK_TOKEN environment variable is not set');
    }

    console.log(`Fetching GitHub user: ${options.username}`);
    const githubUser = await getGitHubUser(options.username, process.env.GITHUB_TOKEN);

    console.log(`The github user is: `);
    console.log(githubUser);

    const gitHubUserDataValidationResult = validateGitHubUserData(githubUser);
    console.log(`The gitHubUserDataValidationResult is: `);
    console.log(gitHubUserDataValidationResult);

    if (gitHubUserDataValidationResult.valid) {
      console.log(`The github user is valid`);
      const freshdeskContact = mapGitHubUserToFreshdeskContact(gitHubUserDataValidationResult.data);
      console.log(`The freshdesk contact which will be created or updated is: `);
      console.log(freshdeskContact);
      const result = await createOrUpdateFreshdeskContact(
        options.subdomain,
        freshdeskContact,
        process.env.FRESHDESK_TOKEN
      );
      console.log(`Success! Contact ${result.action === 'created' ? 'created' : 'updated'} in Freshdesk.`);
      console.log(`Contact ID: ${result.contact.id}`);
      console.log(`Contact Name: ${result.contact.name}`);

    } else {
      console.log(`The github user is invalid:`);
      console.log(gitHubUserDataValidationResult.errors);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main(); 