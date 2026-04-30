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
    /**
     * The description for the item.
     */
    description?: string;
};

export const getUpdateItemRequestURL = (
    item: IItem,
    portalRoot: string,
    updateThumbnail = false
) => {
    const { id, owner, ownerFolder } = item;

    const operation = updateThumbnail ? 'updateThumbnail' : 'update';

    const requestURL = ownerFolder
        ? `${portalRoot}/sharing/rest/content/users/${owner}/${ownerFolder}/items/${id}/${operation}`
        : `${portalRoot}/sharing/rest/content/users/${owner}/items/${id}/${operation}`;

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

/**
 * Updates the thumbnail of an existing ArcGIS Portal item with the provided base64 string of the thumbnail image.
 * @param {IItem} item - The item to be updated. Must contain `id`, `owner`, and optionally `ownerFolder`.
 * @param {string} thumbnailAsBase64 - The new thumbnail image as a base64-encoded string.
 * @param {string} [portalRoot='https://www.arcgis.com'] - The root URL of the ArcGIS Portal.
 * @param {string} token - A valid authentication token for the item owner.
 * @returns {Promise<IUpdateItemResponse>} Resolves with the update response from the Portal REST API.
 *
 * @see https://developers.arcgis.com/rest/users-groups-and-items/update-thumbnail/
 */
export const updateItemWithThumbnail = async ({
    item,
    thumbnailAsBase64,
    portalRoot = 'https://www.arcgis.com',
    token,
}: {
    item: IItem;
    thumbnailAsBase64: string;
    portalRoot?: string;
    token: string;
}): Promise<IUpdateItemResponse> => {
    if (!item) {
        throw new Error('Item data is required to update an item');
    }

    if (!thumbnailAsBase64) {
        throw new Error(
            'Thumbnail (as base64 string) is required to update item thumbnail'
        );
    }

    if (!token) {
        throw new Error('Token is required to update item thumbnail');
    }

    const requestURL = getUpdateItemRequestURL(item, portalRoot, true);

    const requestBody = new URLSearchParams({
        f: 'json',
        token,
        data: thumbnailAsBase64,
    });

    const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
    });

    if (!response.ok) {
        throw new Error(
            `Failed to update item thumbnail. Status: ${response.status}`
        );
    }

    const responseBody = await response.json();

    if (responseBody.error) {
        throw responseBody.error;
    }

    return responseBody as IUpdateItemResponse;
};
