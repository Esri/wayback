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
    // geometry: IPointGeomety;
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

export interface ISpatialReference {
    wkid?: number;
    latestWkid?: number;
    vcsWkid?: number;
    latestVcsWkid?: number;
    wkt?: string;
    latestWkt?: string;
}

export interface IExtent {
    xmin: number;
    ymin: number;
    zmin?: number;
    xmax: number;
    ymax: number;
    zmax?: number;
    spatialReference?: ISpatialReference;
}

export interface IFeature {
    geometry?: any;
    attributes: {
        [key: string]: any;
    };
    // symbol?: ISymbol;
}

export {
    IWaybackConfig,
    IWaybackItem,
    IMapPointInfo,
    IPointGeomety,
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IExtentGeomety,
};
