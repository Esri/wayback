import { IItem, IUpdateItemResponse } from '@esri/arcgis-rest-portal';

/**
 * Object that contains new values for item properties (e.g. 'title', 'snippet', 'tags' and etc) to be updated
 *
 * @example
 * ```
 * {
 *   title: "this is the new title"
 * }
 * ```
 */
export type ItemDataToBeUpdated = {
    // [key: string]: string;
    /**
     * The title for the item
     */
    title?: string;
    /**
     * The summary for the item
     */
    snippet?: string;
    /**
     * The tags for the item
     */
    tags?: string;
    /**
     * The credits (attribution) for the item
     */
    accessInformation?: string;
    /**
     * The license info for the item, which is the Terms of Use
     * section in the item details page
     */
    licenseInfo?: string;
    /**
     * Extent to be updated for the item
     */
    extent?: string;
};

export const getUpdateItemRequestURL = (item: IItem, portalRoot: string) => {
    const { id, owner, ownerFolder } = item;

    const requestURL = ownerFolder
        ? `${portalRoot}/sharing/rest/content/users/${owner}/${ownerFolder}/items/${id}/update`
        : `${portalRoot}/sharing/rest/content/users/${owner}/items/${id}/update`;

    return requestURL;
};

/**
 * Updates an existing ArcGIS Portal item with the provided data.
 *
 * @param {IItem} item - The item to be updated. Must contain `id`, `owner`, and optionally `ownerFolder`.
 * @param {ItemDataToBeUpdated} itemDataToBeUpdated - Object containing the item properties to update (e.g. `title`, `snippet`, `tags`).
 * @param {string} [portalRoot='https://www.arcgis.com'] - The root URL of the ArcGIS Portal.
 * @param {string} token - A valid authentication token for the item owner.
 * @returns {Promise<IUpdateItemResponse>} Resolves with the update response from the Portal REST API.
 * @throws {Error} If `item` or `token` is not provided.
 * @throws {object} If the Portal API returns an error in the response body.
 */
export const updateItem = async ({
    item,
    itemDataToBeUpdated,
    portalRoot = 'https://www.arcgis.com',
    token,
}: {
    item: IItem;
    itemDataToBeUpdated: ItemDataToBeUpdated;
    portalRoot?: string;
    token: string;
}): Promise<IUpdateItemResponse> => {
    if (!item) {
        throw new Error('Item data is required to update an item');
    }

    if (!token) {
        throw new Error('Token is required to update an item');
    }

    const requestURL = getUpdateItemRequestURL(item, portalRoot);

    const requestBody = new URLSearchParams({
        f: 'json',
        token,
        ...itemDataToBeUpdated,
    });

    const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
    });

    if (!response.ok) {
        throw new Error(`Failed to update item. Status: ${response.status}`);
    }

    const responseBody = await response.json();

    if (responseBody.error) {
        throw responseBody.error;
    }

    return responseBody as IUpdateItemResponse;
};
