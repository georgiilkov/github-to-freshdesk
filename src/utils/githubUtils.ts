import axios, { AxiosError } from 'axios';

interface GitHubErrorResponse {
    message?: string;
    documentation_url?: string;
}

export function getGitHubHeaders(token: string): Record<string, string> {
    return {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'GitHub-to-Freshdesk-Sync'
    };
}

export function handleGitHubError(error: unknown, username?: string): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<GitHubErrorResponse>;

        if (axiosError.response?.status === 404 && username) {
            throw new Error(`GitHub user '${username}' not found`);
        }

        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
            throw new Error('GitHub API authentication failed. Check your GITHUB_TOKEN');
        }

        const errorMessage = axiosError.response?.data?.message || axiosError.message;
        throw new Error(`GitHub API error: ${errorMessage}`);
    }

    throw error instanceof Error
        ? error
        : new Error(`Unknown error in GitHub API: ${String(error)}`);
}

export function isGitHubRateLimitError(error: unknown): boolean {
    return axios.isAxiosError(error) &&
        (error.response?.status === 429 ||
            error.response?.data?.message?.includes('rate limit'));
}

export function isGitHubAuthError(error: unknown): boolean {
    return axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403);
} 