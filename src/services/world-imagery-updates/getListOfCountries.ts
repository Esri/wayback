import { getToken } from '@utils/Esri-OAuth';
import { IMAGERY_UPDATES_LAYER_FIELDS, ImageryUpdatesCategory } from './config';
import { getImageryUpdatesUrl } from './helpers';
import { IFeature } from '@esri/arcgis-rest-request';

const cachedResults: Map<ImageryUpdatesCategory, string[]> = new Map();

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
    category: ImageryUpdatesCategory
): Promise<string[]> => {
    if (cachedResults.has(category)) {
        return cachedResults.get(category) as string[];
    }

    const serviceUrl = getImageryUpdatesUrl(category);

    const token = getToken();

    if (!token) {
        throw new Error(
            'Authentication token is required to access the imagery updates service.'
        );
    }

    const params = new URLSearchParams({
        f: 'json',
        token: token,
        returnGeometry: 'false',
        where: '1=1', // Fetch all records
        outFields: IMAGERY_UPDATES_LAYER_FIELDS.COUNTRY_NAME,
        returnDistinctValues: 'true', // Ensure we get distinct country names
    });

    const url = `${serviceUrl}/query?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch data from ${url}: ${response.statusText}`
        );
    }

    const data = await response.json();

    if (!data || data.error || !data.features) {
        throw new Error(
            `Error fetching list of countries: ${
                data.error?.message || 'Unknown error'
            }`
        );
    }

    const features: IFeature[] = data?.features || [];

    const countries: string[] = [];

    for (const feature of features) {
        const countryName = feature.attributes[
            IMAGERY_UPDATES_LAYER_FIELDS.COUNTRY_NAME
        ] as string;

        if (countryName) {
            countries.push(countryName);
        }
    }

    // Remove duplicates and sort the country names
    const distinctCountries = Array.from(new Set(countries)).sort(); // Remove duplicates and sort

    cachedResults.set(category, distinctCountries);

    return distinctCountries;
};
