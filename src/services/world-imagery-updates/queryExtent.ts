import { getToken } from '@utils/Esri-OAuth';
import { ImageryUpdatesCategory } from './config';
import { IExtent } from '@esri/arcgis-rest-request';
import { getImageryUpdatesUrl } from './helpers';

const cachedResults: Map<string, IExtent | null> = new Map();

/**
 * Querys the extent of features in the specified imagery updates category that match the given where clause.
 * @param category the imagery updates category
 * @param whereClause the where clause to filter the query
 * @returns the extent of the features that match the where clause, or null if no features match
 *
 * @throws {Error} if the token is missing
 * @throws {Error} if the request fails
 * @throws {Error} if the response data is invalid or contains an error
 */
export const queryExtent = async (
    category: ImageryUpdatesCategory,
    whereClause: string
): Promise<IExtent | null> => {
    const key = `${category}-${whereClause}`;

    if (cachedResults.has(key)) {
        return cachedResults.get(key) as IExtent | null;
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
        where: whereClause,
        returnGeometry: 'false',
        // outFields: '*',
        returnExtentOnly: 'true',
    });
    const url = `${serviceUrl}/query?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch data from ${url}: ${response.statusText}`
        );
    }
    const data = await response.json();
    if (!data || data.error) {
        throw new Error(data.error?.message || 'Unknown error');
    }
    if (data.extent) {
        const extent: IExtent = {
            xmin: data.extent.xmin,
            ymin: data.extent.ymin,
            xmax: data.extent.xmax,
            ymax: data.extent.ymax,
            spatialReference: data.extent?.spatialReference,
        };

        cachedResults.set(key, extent);
        return extent;
    }
    return null;
};
