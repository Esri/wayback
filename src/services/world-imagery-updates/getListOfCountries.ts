/* Copyright 2024-2026 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getToken } from '@utils/Esri-OAuth';
import {
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    ImageryUpdatesCategory,
    WorldImageryUpdatesStatusEnum,
} from './config';
import { getImageryUpdatesUrl } from './helpers';
import { IFeature } from '@typings/index';
// import { IFeature } from '@esri/arcgis-rest-request';

const cachedResults: Map<string, string[]> = new Map();

/**
 * A helper function to query features with retry logic.
 * It will attempt to fetch the features up to 3 times in case of failure.
 * @param requestUrl - The URL to query features from.
 * @returns A promise that resolves to an array of IFeature objects.
 */
const queryFeaturesWithRetries = async (
    requestUrl: string
): Promise<IFeature[]> => {
    let attempts = 1;
    const maxAttempts = 3;
    const delayBetweenAttempts = 1000; // in milliseconds

    const queryFeatures = async (): Promise<IFeature[]> => {
        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from ${requestUrl}: ${response.statusText}`
            );
        }

        const data = await response.json();

        if (!data || data.error) {
            throw new Error(data.error?.message || 'Unknown error');
        }

        return data?.features || [];
    };

    while (attempts <= maxAttempts) {
        try {
            const features = await queryFeatures();
            return features;
        } catch (error) {
            if (attempts === maxAttempts) {
                throw error;
            }

            attempts++;

            // Wait before retrying
            await new Promise((resolve) =>
                setTimeout(resolve, delayBetweenAttempts * attempts)
            );
        }
    }
    return [];
};

/**
 * Fetches a list of distinct country names for a given imagery updates category.
 * The results are cached to optimize subsequent requests for the same category.
 *
 * @param category - The imagery updates category for which to fetch the list of countries.
 * @returns A promise that resolves to an array of distinct country names, sorted alphabetically.
 *
 * @throws {Error} If the authentication token is missing.
 * @throws {Error} If the request to the imagery updates service fails.
 * @throws {Error} If the response data is invalid or contains an error.
 */
export const getListOfCountries = async (
    category: ImageryUpdatesCategory,
    whereClause: string
): Promise<string[]> => {
    const key = `${category}-${whereClause}`;

    if (cachedResults.has(key)) {
        return cachedResults.get(key) as string[];
    }

    const serviceUrl = getImageryUpdatesUrl(category);

    const token = getToken();

    if (!token) {
        throw new Error(
            'Authentication token is required to access the imagery updates service.'
        );
    }

    const COUNTRY_CODE_FIELD_NAME =
        WORLD_IMAGERY_UPDATES_LAYER_FIELDS.COUNTRY_CODE;

    const params = new URLSearchParams({
        f: 'json',
        token: token,
        returnGeometry: 'false',
        // where: `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_DATE} BETWEEN CURRENT_TIMESTAMP - 365 AND CURRENT_TIMESTAMP) OR ${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} = '${WorldImageryUpdatesStatusEnum.pending}'`, // Fetch all records
        where: whereClause, // Use the provided where clause
        outFields: COUNTRY_CODE_FIELD_NAME, // Only need the Tag field which contains the country code
        returnDistinctValues: 'true', // Ensure we get distinct country codes,
    });

    const url = `${serviceUrl}/query?${params.toString()}`;

    const features: IFeature[] = await queryFeaturesWithRetries(url);

    const countryCodes: string[] = [];

    for (const feature of features) {
        const countryCode = feature.attributes[
            COUNTRY_CODE_FIELD_NAME
        ] as string;

        if (countryCode && countryCode.trim() !== '') {
            countryCodes.push(countryCode);
        }
    }
    // console.log(`Fetched country codes for category "${category}":`, countryCodes);

    // Remove duplicates and sort the country names
    const distinctCountryCodes = Array.from(new Set(countryCodes)).sort(); // Remove duplicates and sort

    cachedResults.set(key, distinctCountryCodes);

    return distinctCountryCodes;
};
