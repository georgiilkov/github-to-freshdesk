export const githubApi = {
  baseUrl: 'https://api.github.com',
  endpoints: {
    user: (username: string) => `${githubApi.baseUrl}/users/${username}`
  }
};

export const freshdeskApi = {
  getBaseUrl: (subdomain: string) => `https://${subdomain}.freshdesk.com/api/v2`,
  endpoints: {
    createContact: (subdomain: string) => `${freshdeskApi.getBaseUrl(subdomain)}/contacts`,
    updateContact: (subdomain: string, contactId: number) => `${freshdeskApi.getBaseUrl(subdomain)}/contacts/${contactId}`,
    searchContactByUniqueExternalId: (subdomain: string, uniqueExternalId: string) => `${freshdeskApi.getBaseUrl(subdomain)}/contacts?unique_external_id=${uniqueExternalId}`
  }
}; 