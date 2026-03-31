import { IItem } from '@esri/arcgis-rest-portal';

type GetItemParams = {
    /**
     * The ID of the item to retrieve.
     * This is a required parameter and must be a valid item ID in the ArcGIS Portal.
     */
    itemId: string;
    /**
     * The root URL of the ArcGIS Portal. This is optional and defaults to "https://www.arcgis.com" if not provided.
     */
    portalRoot?: string;
    /**
     * Authentication token for the ArcGIS Portal API. This is required if the item being retrieved is not public.
     */
    token?: string;
};

export const getItem = async ({
    itemId,
    portalRoot = 'https://www.arcgis.com',
    token,
}: GetItemParams): Promise<IItem> => {
    const requestURL = `${portalRoot}/sharing/rest/content/items/${itemId}?f=json&token=${token}`;

    const response = await fetch(requestURL);

    if (!response.ok) {
        throw new Error(`Failed to get item. Status: ${response.status}`);
    }

    const responseBody = await response.json();

    if (responseBody.error) {
        throw responseBody.error;
    }

    return responseBody as IItem;
};
