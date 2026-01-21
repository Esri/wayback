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

import { PartialRootState } from './configureStore';

import { AppDialogName, initialUIState, UIState } from './UI/reducer';
import { initialWaybackItemsState, WaybackItemsState } from './Wayback/reducer';
import { initialSwipeViewState, SwipeViewState } from './Swipe/reducer';
import { IWaybackItem } from '../types';
import { initialMapState, MapMode, MapState } from './Map/reducer';
import {
    getActiveDialogFromHashParams,
    getAnimationSpeedFromHashParams,
    // decodeURLParams,
    getMapCenterFromHashParams,
    getMapExtentFromURLHashParams,
    getMapModeFromHashParams,
    getReleaseNum4FramesToExcludeFromHashParams,
    getReleaseNumForActiveWaybackItemFromHashParams,
    getReleaseNumsForSelectedWaybackItemsFromHashParams,
    getSwipeWidgetLayersFromHashParams,
} from '@utils/urlParams';

import {
    // getShouldOpenSaveWebMapDialog,
    getDownloadJobsFromLocalStorage,
    // getPreferredReferenceLayerLocale,
    // getDefaultMapLocation,
} from '@utils/LocalStorage';
import {
    ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS,
    AnimationModeState,
    DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS,
    initialAnimationModeState,
} from './AnimationMode/reducer';

import {
    DownloadModeState,
    initialDownloadModeState,
    DownloadJob,
} from './DownloadMode/reducer';
import { IS_MOBILE } from '@constants/UI';
import { getPreloadedState4UpdatesMode } from './UpdatesMode/getPreloadedState';
import { getRandomInterestingPlace } from '@utils/interesting-places';

const getPreloadedState4UI = (
    hashParams: URLSearchParams,
    appLanguage: string
): UIState => {
    // const activeDialog: AppDialogName | null = urlParams.activeDialog || null;

    const activeDialog: AppDialogName | null =
        getActiveDialogFromHashParams(hashParams);

    const state: UIState = {
        ...initialUIState,
        activeDialog,
        appLanguage,
    };

    return state;
};

const getPreloadedState4WaybackItems = (
    waybackItems: IWaybackItem[],
    hashParams: URLSearchParams
): WaybackItemsState => {
    // const { rNum4SelectedWaybackItems, rNum4ActiveWaybackItem } = urlParams;

    const releaseNum4ActiveWaybackItem =
        getReleaseNumForActiveWaybackItemFromHashParams(hashParams);

    const releaseNum4SelectedItems =
        getReleaseNumsForSelectedWaybackItemsFromHashParams(hashParams);

    const byReleaseNumber: {
        [key: number]: IWaybackItem;
    } = {};

    const allReleaseNumbers: number[] = [];

    waybackItems.forEach((item) => {
        const { releaseNum } = item;
        byReleaseNumber[releaseNum] = item;
        allReleaseNumbers.push(releaseNum);
    });

    const state: WaybackItemsState = {
        ...initialWaybackItemsState,
        byReleaseNumber,
        allReleaseNumbers,
        releaseNum4SelectedItems: releaseNum4SelectedItems || [],
        releaseNum4ActiveWaybackItem:
            releaseNum4ActiveWaybackItem || allReleaseNumbers[0],
    };

    return state;
};

const getPreloadedState4SwipeView = (
    hashParams: URLSearchParams,
    waybackItems: IWaybackItem[]
): SwipeViewState => {
    // const {
    //     isSwipeWidgetOpen,
    //     rNum4SwipeWidgetLeadingLayer,
    //     rNum4SwipeWidgetTrailingLayer,
    //     rNum4ActiveWaybackItem,
    // } = urlParams;

    const { releaseNum4LeadingLayer, releaseNum4TrailingLayer } =
        getSwipeWidgetLayersFromHashParams(hashParams);

    const rNum4ActiveWaybackItem =
        getReleaseNumForActiveWaybackItemFromHashParams(hashParams);

    const state: SwipeViewState = {
        ...initialSwipeViewState,
        releaseNum4LeadingLayer:
            releaseNum4LeadingLayer ||
            rNum4ActiveWaybackItem ||
            waybackItems[0].releaseNum,
        releaseNum4TrailingLayer:
            releaseNum4TrailingLayer ||
            waybackItems[waybackItems.length - 1].releaseNum,
    };

    return state;
};

const getPreloadedState4Map = (hashParams: URLSearchParams): MapState => {
    // const { mapExtent } = urlParams;

    // get map extent from the url hash params
    // the app no longer saves extent to URL hash params, but we keep this for backward compatibility
    const mapExtent = getMapExtentFromURLHashParams(hashParams);

    // first try to get the map center and zoom from the hash params
    let initialMapCenter = getMapCenterFromHashParams(hashParams);

    // // then try to get the default map location from the local storage
    // if (!initialMapCenter) {
    //     initialMapCenter = getDefaultMapLocation();
    // }

    // if the map center and mapExtent is not set in the hash params, we will use a random interesting place
    if (!initialMapCenter && !mapExtent) {
        const interestingPlace = getRandomInterestingPlace();

        initialMapCenter = {
            center: {
                lon: interestingPlace.longitude,
                lat: interestingPlace.latitude,
            },
            zoom: interestingPlace.zoom,
        };
    }

    let mode: MapMode = getMapModeFromHashParams(hashParams);

    // we need to set the mode to 'explore' if the device is mobile
    // because the swipe mode and animation mode is not supported on mobile devices
    if (IS_MOBILE) {
        mode = 'explore';
    }

    const state: MapState = {
        ...initialMapState,
        mode,
        mapExtent,
        center: initialMapCenter?.center,
        zoom: initialMapCenter?.zoom,
        // referenceLayerLocale: getPreferredReferenceLayerLocale() || null, //ReferenceLayerLanguage.English,
    };

    return state;
};

const getPreloadedState4AnimationMode = (
    hashParams: URLSearchParams
): AnimationModeState => {
    // let { animationSpeed } = urlParams;
    let animationSpeed = getAnimationSpeedFromHashParams(hashParams);
    // const { rNum4FramesToExclude } = urlParams;
    const rNum4FramesToExclude =
        getReleaseNum4FramesToExcludeFromHashParams(hashParams);

    if (
        animationSpeed === null ||
        typeof animationSpeed !== 'number' ||
        IS_MOBILE
    ) {
        return initialAnimationModeState;
    }

    // use default animation speed if the value from hash params is not in the list of options
    if (
        ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS.includes(+animationSpeed) ===
        false
    ) {
        animationSpeed = DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS;
    }

    const state: AnimationModeState = {
        ...initialAnimationModeState,
        animationStatus: 'loading',
        animationSpeed,
        rNum2Exclude: rNum4FramesToExclude,
    };

    return state;
};

const getPreloadedState4Downloadmode = (
    hashParams: URLSearchParams
): DownloadModeState => {
    const jobs: DownloadJob[] = getDownloadJobsFromLocalStorage();

    const byId: { [key: string]: DownloadJob } = {};
    const ids: string[] = [];

    for (const job of jobs) {
        const { id } = job;
        byId[id] = job;
        ids.push(id);
    }

    const state: DownloadModeState = {
        ...initialDownloadModeState,
        jobs: {
            byId,
            ids,
        },
    };

    return state;
};

const getPreloadedState = async ({
    waybackItems,
    appLanguage,
}: {
    waybackItems: IWaybackItem[];
    appLanguage: string;
}): Promise<PartialRootState> => {
    // get the url params from the current window location hash
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const preloadedState = {
        UI: getPreloadedState4UI(hashParams, appLanguage),
        WaybackItems: getPreloadedState4WaybackItems(waybackItems, hashParams),
        SwipeView: getPreloadedState4SwipeView(hashParams, waybackItems),
        Map: getPreloadedState4Map(hashParams),
        AnimationMode: getPreloadedState4AnimationMode(hashParams),
        DownloadMode: getPreloadedState4Downloadmode(hashParams),
        UpdatesMode: getPreloadedState4UpdatesMode(hashParams),
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
