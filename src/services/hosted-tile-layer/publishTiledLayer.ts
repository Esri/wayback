import { nanoid } from 'nanoid';

type PublishTiledLayerParams = {
    /**
     * The ID of the tile package item to publish as a hosted tile layer.
     */
    itemId: string;
    /**
     * Authentication token for the ArcGIS Portal API.
     */
    token: string;
    /**
     * The username of the owner of the tile package item. This is required to construct the correct API endpoint for publishing the item.
     */
    username: string;
    /**
     * The root URL of the ArcGIS Portal. This is optional and defaults to "https://www.arcgis.com" if not provided.
     */
    portalRoot?: string;
    /**
     * Optional Wayport job ID that will be used in the name of the published service for easier identification.
     */
    wayportJobId?: string;
};

type ServiceResult = {
    /**
     * type of the published service (e.g. "MapServer")
     */
    type: string;
    /**
     * ID of the published service item in ArcGIS Portal
     */
    serviceItemId: string;
    /**
     * URL of the published service endpoint
     */
    serviceurl: string;
    /**
     * size of the published service
     */
    size: number;
    /**
     *  id of the publishing job
     */
    jobId: string;
};

type PublishTiledLayerResponse = {
    services: ServiceResult[];
    /**
     * error information if the publish operation failed
     */
    error?: any;
};

const getUniqueServiceName = (jobId: string) => {
    const uniqueSuffix = jobId || nanoid(6); // use jobId if available, otherwise generate a random string

    // generate a unique service name using the job ID and a random string to ensure uniqueness
    const serviceName = `wayport_tile_layer_${uniqueSuffix}}`;

    // only numbers, letters, and underscores are allowed in service names, so replace any invalid characters with underscores
    return serviceName.replace(/[^a-zA-Z0-9_]/g, '_').toLocaleLowerCase();
};

/**
 * Publishes a tile package item as a hosted tiled map service on ArcGIS Portal.
 *
 * @param params - The parameters for publishing the tiled layer.
 * @param params.itemId - The ID of the tile package item to publish.
 * @param params.token - Authentication token for the ArcGIS Portal API.
 * @param params.username - The username of the item owner, used to construct the publish endpoint.
 * @param params.portalRoot - The root URL of the ArcGIS Portal. Defaults to `"https://www.arcgis.com"`.
 * @param params.wayportJobId - Optional Wayport job ID used in the published service name for identification.
 * @returns The service item ID of the newly published hosted tile layer.
 * @throws If required parameters are missing, the HTTP request fails, or the publish operation returns an error.
 *
 * @see https://developers.arcgis.com/rest/users-groups-and-items/publish-item/
 */
export const publishTiledLayer = async ({
    itemId,
    token,
    username,
    portalRoot = 'https://www.arcgis.com',
    wayportJobId,
}: PublishTiledLayerParams): Promise<ServiceResult> => {
    if (!itemId) {
        throw new Error('itemId is required to publish a tiled layer');
    }

    if (!token) {
        throw new Error('token is required to publish a tiled layer');
    }

    if (!username) {
        throw new Error('username is required to publish a tiled layer');
    }

    // The publish operation publishes a hosted service based on an existing source item.
    const requestUrl = `${portalRoot}/sharing/rest/content/users/${username}/publish`;

    const params = new URLSearchParams({
        itemId,
        fileType: 'tilePackage',
        publishParameters: JSON.stringify({
            name: getUniqueServiceName(wayportJobId),
            maxRecordCount: 1000,
        }),
        buildInitialCache: 'true',
        f: 'json',
        token,
    });

    const res = await fetch(requestUrl, {
        method: 'POST',
        body: params,
    });

    if (!res.ok) {
        throw new Error(
            `Failed to publish tile package item. Status: ${res.status}}`
        );
    }

    const data: PublishTiledLayerResponse = await res.json();

    if (data?.error) {
        throw data.error;
    }
    // console.log(`Publishing service item from item ${itemId} response:`, data);

    const serviceResult = data?.services?.[0];

    if (!serviceResult) {
        throw new Error(
            'Failed to get service publishing result from response'
        );
    }

    // if(serviceResult?.success !== true) {
    //     throw new Error(`Failed to publish item ${itemId} as service`);
    // }

    const serviceItemId = serviceResult?.serviceItemId;

    if (!serviceItemId) {
        throw new Error('Failed to get service item ID from response');
    }

    return serviceResult;
};
