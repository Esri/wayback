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
import { ImageryUpdatesCategory } from './config';
import { IExtent } from '@typings/index';
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
