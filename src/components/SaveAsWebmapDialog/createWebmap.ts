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

// import IEsriConfig from 'esri/config';
// import { loadModules } from 'esri-loader';
import { IWaybackItem, IExtentGeomety } from '@typings/index';
import { getServiceUrl, tier } from '@utils/Tier';
// import EsriRquest from 'esri/request';

// import esriRequest from '@arcgis/core/request';
import esriConfig from '@arcgis/core/config';
import { getCredential, getToken } from '@utils/Esri-OAuth';
import { ReferenceLayerData } from '@constants/map';

interface ICreateWebmapParams {
    title: string;
    tags: string;
    description: string;
    mapExtent: IExtentGeomety;
    waybackItemsToSave?: Array<IWaybackItem>;
    referenceLayer: ReferenceLayerData;
}

interface IWaybackLayerInfo {
    templateUrl: string;
    wmtsInfo: {
        url: string;
        layerIdentifier?: string;
        tileMatrixSet: string;
    };
    visibility: boolean;
    title: string;
    type: string;
    layerType: string;
    itemId: string;
}

interface IMetadataLayerInfo {
    itemId: string;
    visibility: boolean;
    opacity: number;
    title: string;
    layerType: string;
    url: string;
}

interface ICreateWebmapResponse {
    success: boolean;
    id: string;
    folder?: string;
}

const getRequestUrl = () => {
    const credential = getCredential();
    return credential
        ? `${credential.server}/sharing/rest/content/users/${credential.userId}/addItem`
        : '';
};

const WORLD_IMAGERY_BASEMAP_URL_PROD =
    'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/';
const WORLD_IMAGERY_BASEMAP_URL_DEV =
    'https://servicesdev.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/';

const WORLD_IMAGERY_BASEMAP_URL =
    tier === 'production'
        ? WORLD_IMAGERY_BASEMAP_URL_PROD
        : WORLD_IMAGERY_BASEMAP_URL_DEV;

const getOperationalLayers = (waybackItems: Array<IWaybackItem>) => {
    const operationalLayers: Array<IWaybackLayerInfo | IMetadataLayerInfo> = [];

    waybackItems.forEach((waybackItem, index) => {
        const isVisible = index === 0 ? true : false;

        const waybackLayerInfo: IWaybackLayerInfo = {
            templateUrl: waybackItem.itemURL,
            wmtsInfo: {
                url: getServiceUrl('wayback-imagery-base'),
                // layerIdentifier: waybackItem.itemReleaseName || '',
                tileMatrixSet: 'default028mm',
            },
            visibility: isVisible,
            title: waybackItem.itemTitle,
            type: 'WebTiledLayer',
            layerType: 'WebTiledLayer',
            itemId: waybackItem.itemID,
        };

        const metadataLayerTitle = 'Metadata for ' + waybackItem.itemTitle;

        const metadataLayerInfo: IMetadataLayerInfo = {
            itemId: waybackItem.metadataLayerItemID,
            visibility: isVisible,
            opacity: 1,
            title: metadataLayerTitle,
            layerType: 'ArcGISMapServiceLayer',
            url: waybackItem.metadataLayerUrl,
        };

        operationalLayers.push(waybackLayerInfo, metadataLayerInfo);
    });

    return operationalLayers;
};

const getRequestText = (
    waybackItems: Array<IWaybackItem>,
    referenceLayer: ReferenceLayerData
) => {
    const requestText = {
        operationalLayers: getOperationalLayers(waybackItems),
        baseMap: {
            baseMapLayers: [
                {
                    id: 'defaultBasemap',
                    layerType: 'ArcGISTiledMapServiceLayer',
                    url: WORLD_IMAGERY_BASEMAP_URL, //getServiceUrl('world-imagery-basemap'),
                    visibility: true,
                    opacity: 1,
                    title: 'World Imagery',
                },
                {
                    type: 'VectorTileLayer',
                    layerType: 'VectorTileLayer',
                    title: referenceLayer.title, //'Hybrid Reference Layer (Local Language)',
                    styleUrl: referenceLayer.url, //getServiceUrl('reference-layer'),
                    // itemId: '2a2e806e6e654ea78ecb705149ceae9f',
                    visibility: true,
                    isReference: true,
                    opacity: 1,
                },
            ],
            title: 'Imagery Hybrid',
        },
        spatialReference: { wkid: 102100, latestWkid: 3857 },
        version: '2.15',
        authoringApp: 'Wayback',
        authoringAppVersion: '1.0.0',
    };

    return JSON.stringify(requestText);
};

const getSnippetStr = (waybackItems: Array<IWaybackItem>) => {
    const releaseDates = waybackItems.map((d) => d.releaseDateLabel);
    let snippetStr = 'Wayback imagery from ';

    if (releaseDates.length === 1) {
        return snippetStr + releaseDates[0];
    }

    snippetStr += releaseDates.slice(0, releaseDates.length - 1).join(', '); // concat all items but the last one, so we will have "a, b, c"
    snippetStr += ' and ' + releaseDates[releaseDates.length - 1]; // add last one to str with and in front, so we will have "a, b, c and d"
    return snippetStr;
};

const createWebmap = async ({
    title = '',
    tags = '',
    description = '',
    mapExtent = null,
    waybackItemsToSave = [],
    referenceLayer,
}: ICreateWebmapParams): Promise<ICreateWebmapResponse> => {
    if (!waybackItemsToSave.length) {
        return null;
    }

    const credential = getCredential();

    if (credential.server !== 'https://www.arcgis.com') {
        esriConfig.request.trustedServers.push(credential.server);
    }

    const requestUrl = getRequestUrl();

    const requestBody = new URLSearchParams({
        title,
        description,
        tags,
        extent: mapExtent
            ? [
                  mapExtent.xmin,
                  mapExtent.ymin,
                  mapExtent.xmax,
                  mapExtent.ymax,
              ].join(',')
            : null,
        snippet: getSnippetStr(waybackItemsToSave),
        text: getRequestText(waybackItemsToSave, referenceLayer),
        type: 'Web Map',
        overwrite: 'true',
        f: 'json',
        token: getToken(),
    });

    try {
        const createWebmapResponse = await fetch(requestUrl, {
            method: 'post',
            body: requestBody,
        });
        console.log(createWebmapResponse);

        const results = await createWebmapResponse.json();

        return results && !results.error ? results : null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default createWebmap;
