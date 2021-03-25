// import IEsriConfig from 'esri/config';
// import { loadModules } from 'esri-loader';
import { IWaybackItem, IUserSession, IExtentGeomety } from '../../types';
import { getServiceUrl } from '../../utils/Tier';
// import EsriRquest from 'esri/request';

import esriRequest from '@arcgis/core/request';
import esriConfig from '@arcgis/core/config';

interface ICreateWebmapParams {
    title: string;
    tags: string;
    description: string;
    mapExtent: IExtentGeomety;

    userSession: IUserSession;
    waybackItemsToSave?: Array<IWaybackItem>;
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

const getRequestUrl = (userSession: IUserSession) => {
    const credential = userSession.credential;
    return credential
        ? `${credential.server}/sharing/rest/content/users/${credential.userId}/addItem`
        : '';
};

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

const getRequestText = (waybackItems: Array<IWaybackItem>) => {
    const requestText = {
        operationalLayers: getOperationalLayers(waybackItems),
        baseMap: {
            baseMapLayers: [
                {
                    id: 'defaultBasemap',
                    layerType: 'ArcGISTiledMapServiceLayer',
                    url: getServiceUrl('world-imagery-basemap'),
                    visibility: true,
                    opacity: 1,
                    title: 'World Imagery',
                },
                {
                    type: 'VectorTileLayer',
                    layerType: 'VectorTileLayer',
                    title: 'Hybrid Reference Layer (Local Language)',
                    styleUrl: getServiceUrl('reference-layer'),
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
    snippetStr += releaseDates.slice(0, releaseDates.length - 1).join(', '); // concat all items but the last one, so we will have "a, b, c"
    snippetStr += ' and ' + releaseDates[releaseDates.length - 1]; // add last one to str with and in front, so we will have "a, b, c and d"
    return snippetStr;
};

const createWebmap = async ({
    title = '',
    tags = '',
    description = '',
    userSession = null,
    mapExtent = null,
    waybackItemsToSave = [],
}: ICreateWebmapParams): Promise<ICreateWebmapResponse> => {
    if (!waybackItemsToSave.length) {
        return null;
    }

    // type Modules = [
    //     typeof IEsriConfig,
    //     typeof EsriRquest
    // ];

    // const [ esriConfig, esriRequest ] = await (loadModules([
    //     'esri/config',
    //     'esri/request'
    // ]) as Promise<Modules>);

    if (userSession.credential.server !== 'https://www.arcgis.com') {
        esriConfig.request.trustedServers.push(userSession.credential.server);
    }

    const requestUrl = getRequestUrl(userSession);

    const formData = new FormData();

    const uploadRequestContent = {
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
        text: getRequestText(waybackItemsToSave),
        type: 'Web Map',
        overwrite: 'true',
        f: 'json',
        token: userSession.credential.token,
    };

    Object.keys(uploadRequestContent).map((key) => {
        formData.append(key, uploadRequestContent[key]);
    });

    try {
        const createWebmapResponse = await esriRequest(requestUrl, {
            method: 'post',
            body: formData,
        });
        console.log(createWebmapResponse);

        return createWebmapResponse.data && !createWebmapResponse.data.error
            ? createWebmapResponse.data
            : null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default createWebmap;
