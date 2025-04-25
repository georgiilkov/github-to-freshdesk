import axios from 'axios';
import { getGitHubUser } from '../../src/services/githubService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../src/config/api', () => ({
    githubApi: {
        endpoints: {
            user: (username: string) => `https://some-url/${username}`
        }
    }
}));

describe('githubService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getGitHubUser', () => {
        const username = 'testuser';
        const token = 'test-token';
        const mockUser = {
            id: 123,
            login: 'testuser',
            name: 'Test User'
        };

        it('should fetch a user successfully', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: mockUser });
            const result = await getGitHubUser(username, token);
            expect(result).toEqual(mockUser);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `https://some-url/testuser`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `token test-token`,
                        'User-Agent': 'GitHub-to-Freshdesk-Sync'
                    }
                }
            );
        });

        it('should throw error when user is not found', async () => {
            const errorResponse = {
                response: {
                    status: 404,
                    data: { message: 'Not Found' }
                }
            };
            mockedAxios.get.mockRejectedValueOnce(errorResponse);
            mockedAxios.isAxiosError.mockReturnValueOnce(true);
            await expect(getGitHubUser(username, token))
                .rejects
                .toThrow(`GitHub user '${username}' not found`);
        });

        it('should throw error when authentication fails', async () => {
            const errorResponse = {
                response: {
                    status: 401,
                    data: { message: 'Bad credentials' }
                }
            };
            mockedAxios.get.mockRejectedValueOnce(errorResponse);
            mockedAxios.isAxiosError.mockReturnValueOnce(true);
            await expect(getGitHubUser(username, token))
                .rejects
                .toThrow('GitHub API authentication failed. Check your GITHUB_TOKEN');
        });

        it('should throw error for other API errors', async () => {
            const errorResponse = {
                response: {
                    status: 500,
                    data: { message: 'Internal Server Error' }
                }
            };
            mockedAxios.get.mockRejectedValueOnce(errorResponse);
            mockedAxios.isAxiosError.mockReturnValueOnce(true);
            await expect(getGitHubUser(username, token))
                .rejects
                .toThrow('GitHub API error: Internal Server Error');
        });

        it('should throw error for network issues', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
            mockedAxios.isAxiosError.mockReturnValueOnce(false);
            await expect(getGitHubUser(username, token))
                .rejects
                .toThrow('Network Error');
        });
    });
}); 