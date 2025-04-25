import axios from 'axios';
import { githubApi } from '../config/api';
import { getGitHubHeaders, handleGitHubError } from '../utils/githubUtils';

export async function getGitHubUser(
  username: string,
  token: string
): Promise<unknown> {
  try {
    const response = await axios.get(
      githubApi.endpoints.user(username),
      { headers: getGitHubHeaders(token) }
    );
    return response.data;
  } catch (error) {
    handleGitHubError(error, username);
  }
} 