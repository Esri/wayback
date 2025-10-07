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

import { AppDialogName } from '@store/UI/reducer';
import { WaybackConfig, WaybackItem } from '@esri/wayback-core';

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
    activeDialog: AppDialogName;
}

interface IStaticTooltipData {
    content: string;
    top: number;
    left: number;
}

export {
    IWaybackConfig,
    IWaybackItem,
    IMapPointInfo,
    IPointGeomety,
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IExtentGeomety,
    IURLParamData,
    IStaticTooltipData,
};
