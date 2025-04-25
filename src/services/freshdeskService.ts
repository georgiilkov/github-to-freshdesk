import axios from 'axios';
import { FreshdeskContact } from '../types/freshdeskContact';
import { FreshdeskResult } from '../types/freshdeskResult';
import { freshdeskApi } from '../config/api';
import {
    getFreshdeskHeaders,
    isFreshDeskConflictingStateError,
    handleFreshdeskError
} from '../utils/freshdeskUtils';


async function createFreshdeskContact(
    subdomain: string,
    contact: FreshdeskContact,
    headers: Record<string, string>
): Promise<FreshdeskResult> {
    const createResponse = await axios.post<FreshdeskContact & { id: number }>(
        freshdeskApi.endpoints.createContact(subdomain),
        contact,
        { headers }
    );
    return {
        action: 'created',
        contact: createResponse.data
    };
}

async function updateFreshdeskContact(
    subdomain: string,
    contact: FreshdeskContact,
    headers: Record<string, string>
): Promise<FreshdeskResult> {
    const searchResponse = await axios.get(
        freshdeskApi.endpoints.searchContactByUniqueExternalId(subdomain, contact.unique_external_id),
        { headers }
    );
    if (searchResponse.data.length === 0) {
        throw new Error(`Could not find contact with unique_external_id: ${contact.unique_external_id}`);
    }
    const existingContact = searchResponse.data[0];
    const updateResponse = await axios.put<FreshdeskContact & { id: number }>(
        freshdeskApi.endpoints.updateContact(subdomain, existingContact.id),
        contact,
        { headers }
    );
    return {
        action: 'updated',
        contact: updateResponse.data
    };
}

export async function createOrUpdateFreshdeskContact(
    subdomain: string,
    contact: FreshdeskContact,
    token: string
): Promise<FreshdeskResult> {
    try {
        const headers = getFreshdeskHeaders(token);
        try {
            return await createFreshdeskContact(subdomain, contact, headers);
        } catch (createError) {
            if (isFreshDeskConflictingStateError(createError)) {
                console.log('Contact may already exists. Finding and updating...');
                return await updateFreshdeskContact(subdomain, contact, headers);
            }
            throw createError;
        }
    } catch (error) {
        handleFreshdeskError(error);
    }
} 