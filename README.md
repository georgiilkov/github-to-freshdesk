# GitHub to Freshdesk Contact Sync

A TypeScript command-line tool that retrieves information about a GitHub user and creates or updates a corresponding contact in Freshdesk.



## Prerequisites

- Node.js (v14 or higher)
- GitHub Personal Access Token
- Freshdesk API Key

## Installation

1. Clone this repository


2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Create a `.env` file in the project root with your API tokens:
   ```
   GITHUB_TOKEN=your_github_token_here
   FRESHDESK_TOKEN=your_freshdesk_api_key_here
   ```

## Usage

Run the CLI with the required parameters:

```
npm start -- -u <github_username> -d <freshdesk_subdomain>
```



### Parameters

- `-u, --username`: GitHub username to fetch
- `-d, --subdomain`: Your Freshdesk subdomain (the part before `.freshdesk.com`)

### Example

```
npm start -- -u octocat -d mycompany
```

## Field Mapping

The tool maps these GitHub user fields to Freshdesk contact fields:

| GitHub Field | Freshdesk Field |
|--------------|-----------------|
| name (or login) | name |
| id | unique_external_id |
| email | email |



## Unit testing
There are some unit tests.
- `npm run test` - Run tests