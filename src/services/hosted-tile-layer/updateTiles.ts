/* Copyright 2024 Esri
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

import { IExtent } from '@typings/index';
import { delay } from '@utils/snippets/delay';

type UpdateTilesParams = {
    /**
     * The URL of the hosted tile service endpoint to update the tiles for.
     */
    serviceUrl: string;
    /**
     * Array of level IDs to update tiles for. If not provided, tiles for all levels will be updated.
     */
    levels: number[];
    /**
     * The extent of the area to update tiles for. If not provided, tiles for the entire service will be updated.
     */
    extent: IExtent;
    /**
     * Authentication token for the ArcGIS Portal API.
     */
    token: string;
};

type UpdateTilesResponse = {
    id: string;
    name: string;
    status: 'success' | 'failed';
    itemId: string;
    type: string;
    jobId: string;
    error?: {
        code: number;
        message: string;
        details: string[];
    };
};

const getAdminUrlFromServiceUrl = (serviceUrl: string): string => {
    if (!serviceUrl.includes('/rest/services/')) {
        throw new Error('Invalid service URL format');
    }
    return serviceUrl.replace('/rest/services/', '/rest/admin/services/');
};

/**
 * Updates (rebuilds) the tile cache for a hosted tile service within a specified extent and set of zoom levels.
 * Constructs the admin endpoint from the service URL and sends an update request to the ArcGIS REST API.
 *
 * @param params - The parameters for updating tiles.
 * @param params.serviceUrl - The URL of the hosted tile service endpoint to update.
 * @param params.levels - Array of zoom level IDs to update. Defaults to levels 1–22 if empty.
 * @param params.extent - The geographic extent of the area to update tiles for.
 * @param params.token - Authentication token for the ArcGIS Portal API.
 * @returns The update tiles response containing the job ID and status.
 * @throws If required parameters are missing, the HTTP request fails, or the API returns an error.
 *
 * @see https://developers.arcgis.com/rest/services-reference/online/update-tiles/
 */
export const updateTiles = async ({
    serviceUrl,
    levels,
    extent,
    token,
}: UpdateTilesParams): Promise<UpdateTilesResponse> => {
    if (!serviceUrl) {
        throw new Error('serviceUrl is required to update tiles');
    }

    if (!token) {
        throw new Error('token is required to update tiles');
    }

    // Construct the admin URL for the service by replacing the "/rest/services/" part of the service URL with "/rest/admin/services/"
    const adminUrl = getAdminUrlFromServiceUrl(serviceUrl);

    const requestUrl = `${adminUrl}/updateTiles`;

    if (!levels || levels.length === 0) {
        // If levels are not provided, we will update all tiles by sending an empty levels parameter
        levels = Array.from({ length: 22 }, (_, i) => i + 1);
    }

    const params = new URLSearchParams({
        levels: levels.join(','),
        f: 'json',
        extent: `${extent.xmin},${extent.ymin},${extent.xmax},${extent.ymax}`,
        token,
    });

    const res = await fetch(requestUrl, {
        method: 'POST',
        body: params,
    });

    if (!res.ok) {
        throw new Error(
            `Failed to update tiles for service ${serviceUrl}. Status: ${res.status}}`
        );
    }

    const data: UpdateTilesResponse = await res.json();

    if (data?.error) {
        throw data.error;
    }

    // console.log(`Updating tiles for service ${serviceUrl} response:`, data);

    return data;
};

type CheckUpdateTilesStatusParams = {
    serviceUrl: string;
    token: string;
};

type HostedMapServiceAdminJSONResponse = {
    cacheExecutionStatus?: 'SUBMITTED' | 'PROCESSING' | 'NONE';
    serviceId: string;
    itemId: string;
    [key: string]: any;
};

/**
 * Checks whether a tile cache update is currently in progress for a hosted tile service.
 * Queries the service's admin endpoint and inspects the `cacheExecutionStatus` field.
 *
 * @param params.serviceUrl - The URL of the hosted tile service endpoint.
 * @param params.token - Authentication token for the ArcGIS Portal API.
 * @returns `true` if the cache status is `SUBMITTED` or `PROCESSING`, `false` otherwise.
 * @throws If required parameters are missing, the HTTP request fails, the API returns an error, or the status field is absent.
 */
export const checkUpdateTilesStatus = async ({
    serviceUrl,
    token,
}: CheckUpdateTilesStatusParams): Promise<boolean> => {
    if (!serviceUrl) {
        throw new Error('serviceUrl is required to check update tiles status');
    }

    if (!token) {
        throw new Error('token is required to check update tiles status');
    }

    const adminUrl = getAdminUrlFromServiceUrl(serviceUrl);

    const requestUrl = `${adminUrl}?f=json&token=${token}`;

    const res = await fetch(requestUrl);

    if (!res.ok) {
        throw new Error(
            `Failed to check update tiles status for service ${serviceUrl}. Status: ${res.status}}`
        );
    }

    const data: HostedMapServiceAdminJSONResponse = await res.json();

    if (data?.error) {
        throw data.error;
    }

    const cacheExecutionStatus = data?.cacheExecutionStatus || '';

    if (!cacheExecutionStatus) {
        throw new Error(
            `Failed to get cache execution status from response for service ${serviceUrl}`
        );
    }

    return (
        cacheExecutionStatus === 'SUBMITTED' ||
        cacheExecutionStatus === 'PROCESSING'
    );
};

// /**
//  * Updates tiles for a hosted tile service and polls until the cache rebuild is complete.
//  * Sends an update request via {@link updateTiles}, then repeatedly checks the service's
//  * admin endpoint for cache execution status until processing finishes or a timeout is reached.
//  *
//  * @param params - The parameters for updating tiles.
//  * @param params.serviceUrl - The URL of the hosted tile service endpoint to update.
//  * @param params.levels - Array of zoom level IDs to update.
//  * @param params.extent - The geographic extent of the area to update tiles for.
//  * @param params.token - Authentication token for the ArcGIS Portal API.
//  * @throws If the update request fails, returns a non-success status, or the polling times out (15 minutes).
//  */
// export const updateTilesAndWaitForCompletion = async (
//     params: UpdateTilesParams
// ): Promise<void> => {
//     // send the update tiles request
//     const updateResponse = await updateTiles(params);

//     if (updateResponse.status !== 'success') {
//         throw new Error(
//             `Failed to start updating tiles for service ${params.serviceUrl}`
//         );
//     }

//     // poll the service admin endpoint until the tile update job is completed
//     const maxWaitTime = 15 * 60 * 1000; // 1 hour
//     const startTime = Date.now();
//     const delayBetweenPolls = 5000; // 5 seconds

//     while (true) {
//         await delay(delayBetweenPolls);

//         const isProcessing = await checkUpdateTilesStatus({
//             serviceUrl: params.serviceUrl,
//             token: params.token,
//         });

//         if (!isProcessing) {
//             // If not processing, we assume the job is completed. In a more robust implementation, we would check for failed status as well.
//             break;
//         }

//         if (Date.now() - startTime > maxWaitTime) {
//             throw new Error(
//                 `Timed out waiting for tile update to complete for service ${params.serviceUrl}`
//             );
//         }
//     }

//     return;
// };
