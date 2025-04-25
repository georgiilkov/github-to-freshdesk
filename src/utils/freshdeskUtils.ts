import axios, { AxiosError } from 'axios';

interface FreshdeskErrorResponse {
    errors?: {
        description?: string[];
    };
    message?: string;
    code?: string;
}
export function getFreshdeskHeaders(token: string): Record<string, string> {
    const auth = Buffer.from(`${token}:X`).toString('base64');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
    };
}
export function isFreshDeskConflictingStateError(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 409;
}
export function handleFreshdeskError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<FreshdeskErrorResponse>;

        if (axiosError.response?.status === 401) {
            throw new Error('Freshdesk API authentication failed. Check your FRESHDESK_TOKEN');
        }

        if (axiosError.response?.status === 400) {
            console.error('Full error response:', JSON.stringify(axiosError.response.data, null, 2));
            throw new Error('Freshdesk API error: Invalid request');
        }

        const errorDescription = axiosError.response?.data?.errors?.description?.[0];
        const errorMessage = errorDescription ||
            axiosError.response?.data?.message ||
            axiosError.message;

        throw new Error(`Freshdesk API error: ${errorMessage}`);
    }

    throw error instanceof Error
        ? error
        : new Error(`Unknown error in Freshdesk API: ${String(error)}`);
} 