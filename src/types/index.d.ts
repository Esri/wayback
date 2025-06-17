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

// import IPortal from 'esri/portal/Portal';
// import ICredential from 'esri/identity/Credential';
// import Credential from '@arcgis/core/identity/Credential';
// import Portal from '@arcgis/core/portal/Portal';

import { WaybackConfig, WaybackItem } from '@vannizhang/wayback-core';

// interface IWaybackConfig {
//     [key: number]: {
//         itemID: string;
//         itemTitle: string;
//         itemURL: string;
//         metadataLayerItemID: string;
//         metadataLayerUrl: string;
//         itemReleaseName: string;
//         layerIdentifier?: string;
//     };
// }

type IWaybackConfig = WaybackConfig;

// interface IWaybackItem {
//     releaseNum: number;
//     releaseDateLabel: string;
//     releaseDatetime: number;
//     itemReleaseName: string;
//     itemID: string;
//     itemTitle: string;
//     itemURL: string;
//     metadataLayerItemID: string;
//     metadataLayerUrl: string;
//     layerIdentifier?: string;
// }

type IWaybackItem = WaybackItem;

interface IPointGeomety {
    x: number;
    y: number;
    spatialReference: {
        latestWkid: number;
        wkid: number;
    };
}

interface IExtentGeomety {
    xmax: number;
    xmin: number;
    ymax: number;
    ymin: number;
    spatialReference: {
        latestWkid?: number;
        wkid: number;
    };
}

interface IMapPointInfo {
    longitude: number;
    latitude: number;
    zoom: number;
    geometry: IPointGeomety;
}

interface IWaybackMetadataQueryResult {
    date: number;
    provider: string;
    source: string;
    resolution: number;
    accuracy: number;
    releaseDate?: string;
    queryLocation: {
        longitude: number;
        latitude: number;
    };
}

interface IScreenPoint {
    x: number;
    y: number;
}

// interface IUserSession {
//     portal: Portal;
//     credential: Credential;
// }

interface IURLParamData {
    mapExtent?: IExtentGeomety;
    rNum4SelectedWaybackItems?: Array<number>;
    shouldOnlyShowItemsWithLocalChange?: boolean;
    rNum4ActiveWaybackItem?: number;
    isSwipeWidgetOpen?: boolean;
    rNum4SwipeWidgetLeadingLayer?: number;
    rNum4SwipeWidgetTrailingLayer?: number;
    animationSpeed?: number;
    rNum4FramesToExclude?: number[];
    isDownloadDialogOpen?: boolean;
}

interface IStaticTooltipData {
    content: string;
    top: number;
    left: number;
}

// type ValidServiceUrlNames =
// | 'portal-url'
// 'wayback-imagery-base';
// | 'wayback-config'
// | 'wayback-change-detector-layer'
// | 'reference-layer'
// | 'world-imagery-basemap'

interface IAppConfig {
    defaultMapExtent?: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: {
            wkid: 4326;
        };
    };
}

type TIER = 'production' | 'development';

export {
    IWaybackConfig,
    IWaybackItem,
    IMapPointInfo,
    IPointGeomety,
    IWaybackMetadataQueryResult,
    IScreenPoint,
    // IUserSession,
    IExtentGeomety,
    IURLParamData,
    IStaticTooltipData,
    // ValidServiceUrlNames,
    IAppConfig,
    TIER,
};
