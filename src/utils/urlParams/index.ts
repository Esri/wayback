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

import { MapCenter, MapMode } from '@store/Map/reducer';
import { AppDialogName } from '@store/UI/reducer';
import { UpdatesModeState } from '@store/UpdatesMode/reducer';
import { IExtentGeomety } from '@typings/index';

type ParamKey =
    | 'mapCenter' // map center in the format of lon,lat,zoom
    | 'mode' // Map mode: explore, updates, swipe, animation
    | 'selected' // release numbers of the selected wayback items
    | 'active' // release number of the active wayback item
    | 'swipeWidget' // leading and trailing layer release numbers for swipe widget
    | 'animationSpeed' // animation speed in milliseconds
    | 'framesToExclude' // release numbers of frames to exclude in animation mode
    | 'updatesLayer' // Updates Mode data in the format of status|category|region
    | 'activeDialog' // the active dialog name
    | 'ext'; // map extent, which is no longer used but kept for backward compatibility

type SaveSwipeWidgetInfoToHashParams = (params: {
    isOpen: boolean;
    rNum4SwipeWidgetLeadingLayer?: number;
    rNum4SwipeWidgetTrailingLayer?: number;
}) => void;

const hashParams = new URLSearchParams();

/**
 * update Hash Params in the URL using data from hashParams
 */
export const updateHashParams = (key: ParamKey, value: string) => {
    // const hashParams = getHashParams();

    if (value === undefined || value === null) {
        hashParams.delete(key);
    } else {
        hashParams.set(key, value);
    }

    // window.location.hash = hashParams.toString();

    // Get the current URL without the hash
    const baseUrl = window.location.href.split('#')[0];

    const newHash = hashParams.toString();

    const newUrl = `${baseUrl}#${newHash}`;

    // Update the URL using replaceState
    window.history.replaceState(null, '', newUrl);
};

export const getHashParamValueByKey = (
    key: ParamKey,
    hashParams: URLSearchParams
): string => {
    // const hashParams = getHashParams();

    if (!hashParams.has(key)) {
        return null;
    }

    return hashParams.get(key);
};

export const saveReleaseNum4SelectedWaybackItemsToHashParams = (
    rNum4SelectedWaybackItems: number[]
): void => {
    const key: ParamKey = 'selected';
    const value = rNum4SelectedWaybackItems.length
        ? rNum4SelectedWaybackItems.join(',')
        : null;

    updateHashParams(key, value);
};

export const saveReleaseNum4ActiveWaybackItemToHashParams = (
    rNum4ActiveWaybackItem: number
): void => {
    const key: ParamKey = 'active';
    const value = rNum4ActiveWaybackItem
        ? rNum4ActiveWaybackItem.toString()
        : null;

    updateHashParams(key, value);
};

export const saveSwipeWidgetInfoToHashParams: SaveSwipeWidgetInfoToHashParams =
    ({
        isOpen,
        rNum4SwipeWidgetLeadingLayer,
        rNum4SwipeWidgetTrailingLayer,
    }) => {
        const key: ParamKey = 'swipeWidget';
        const value = isOpen
            ? `${rNum4SwipeWidgetLeadingLayer},${rNum4SwipeWidgetTrailingLayer}`
            : null;

        updateHashParams(key, value);
    };

export const saveAnimationSpeedToHashParams = (speed?: number): void => {
    const key: ParamKey = 'animationSpeed';
    const value = speed !== undefined ? speed.toString() : null;

    updateHashParams(key, value);
};

export const saveFrames2ExcludeToHashParams = (rNums: number[]): void => {
    const key: ParamKey = 'framesToExclude';
    const value = rNums && rNums.length ? rNums.join(',') : null;

    updateHashParams(key, value);
};

export const saveMapCenterToHashParams = (center: MapCenter, zoom: number) => {
    const { lon, lat } = center;
    const value = `${lon.toFixed(5)},${lat.toFixed(5)},${zoom}`;
    updateHashParams('mapCenter', value);
    // remove ext from URL as it is no longer needed
    updateHashParams('ext', null);
};

export const getMapCenterFromHashParams = (hashParams: URLSearchParams) => {
    const value = getHashParamValueByKey('mapCenter', hashParams);

    if (!value) {
        return null;
    }

    const [lon, lat, zoom] = value.split(',').map((d) => +d);

    return {
        center: {
            lon,
            lat,
        },
        zoom,
    };
};

export const saveMapModeToHashParams = (mode: MapMode): void => {
    const key: ParamKey = 'mode';
    const value = mode ? mode : null;
    updateHashParams(key, value);
};

export const getMapModeFromHashParams = (
    hashParams: URLSearchParams
): MapMode => {
    const value = getHashParamValueByKey('mode', hashParams);
    if (!value) {
        return 'explore';
    }

    const validModes: MapMode[] = [
        'explore',
        'updates',
        'swipe',
        'animation',
        'wayport',
    ];

    if (!validModes.includes(value as MapMode)) {
        return 'explore'; // default mode
    }

    return value as MapMode;
};

/**
 * Get the active dialog name from hash params
 * @returns the active dialog name from hash params, or null if the value is not valid
 */
export const getActiveDialogFromHashParams = (
    hashParams: URLSearchParams
): AppDialogName => {
    const value = getHashParamValueByKey('activeDialog', hashParams);

    if (!value) {
        return null;
    }

    const validDialogs: AppDialogName[] = [
        'about',
        // 'export',
        'save',
        // 'setting',
    ];

    if (!validDialogs.includes(value as AppDialogName)) {
        return null;
    }
    return value as AppDialogName;
};

export const getAnimationSpeedFromHashParams = (
    hashParams: URLSearchParams
): number => {
    const value = getHashParamValueByKey('animationSpeed', hashParams);
    if (!value || /\d/.test(value) === false) {
        return null;
    }
    return +value;
};

export const getReleaseNum4FramesToExcludeFromHashParams = (
    hashParams: URLSearchParams
): number[] => {
    const value = getHashParamValueByKey('framesToExclude', hashParams);
    if (!value) {
        return [];
    }
    return value.split(',').map((rNum) => +rNum);
};

/**
 * Retrieve the leading and trailing layer release numbers for the swipe widget from URL hash params.
 * @param hashParams
 * @returns
 */
export const getSwipeWidgetLayersFromHashParams = (
    hashParams: URLSearchParams
): {
    releaseNum4LeadingLayer: number;
    releaseNum4TrailingLayer: number;
} => {
    const value = getHashParamValueByKey('swipeWidget', hashParams);
    if (!value) {
        return {
            releaseNum4LeadingLayer: null,
            releaseNum4TrailingLayer: null,
        };
    }
    const layers = value
        .split(',')
        .filter((d) => /\d/.test(d))
        .map((d) => +d);
    return {
        releaseNum4LeadingLayer: layers[0] || null,
        releaseNum4TrailingLayer: layers[1] || null,
    };
};

export const getReleaseNumForActiveWaybackItemFromHashParams = (
    hashParams: URLSearchParams
): number => {
    const value = getHashParamValueByKey('active', hashParams);
    if (!value || /\d/.test(value) === false) {
        return null;
    }
    return +value;
};

export const getReleaseNumsForSelectedWaybackItemsFromHashParams = (
    hashParams: URLSearchParams
): number[] => {
    const value = getHashParamValueByKey('selected', hashParams);
    if (!value) {
        return [];
    }
    return value
        .split(',')
        .filter((d) => /\d/.test(d))
        .map((d) => +d);
};

/**
 * Save Updates Mode data in the URL hash params
 * @param data - Updates Mode data to be saved
 * @returns void
 */
export const saveUpdatesModeDataInURLHashParams = (
    data: UpdatesModeState
): void => {
    const {
        // status,
        category,
        region,
    } = data;

    const dataToSave = [
        // status.join(','),
        category,
        region,
    ].join('|');

    updateHashParams('updatesLayer', dataToSave);
};

/**
 * Retrieve map extent from URL hash params. The app no longer saves extent to URL hash params,
 * but this function is kept for backward compatibility in case users have ext param in their URLs.
 * @param hashParams
 * @returns
 */
export const getMapExtentFromURLHashParams = (
    hashParams: URLSearchParams
): IExtentGeomety => {
    const extent = getHashParamValueByKey('ext', hashParams);

    if (!extent) {
        return null;
    }

    const ext = extent.split(',').map((d) => +d);

    const mapExtent: IExtentGeomety =
        ext && ext.length === 4
            ? {
                  xmin: ext[0],
                  ymin: ext[1],
                  xmax: ext[2],
                  ymax: ext[3],
                  spatialReference: {
                      wkid: 4326,
                  },
              }
            : null;

    return mapExtent;
};
