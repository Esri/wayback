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
import { IURLParamData, IWaybackItem } from '../types';
import { initialMapState, MapMode, MapState } from './Map/reducer';
import {
    decodeURLParams,
    getMapCenterFromHashParams,
    getMapModeFromHashParams,
} from '../utils/UrlSearchParam';

import {
    getShouldOpenSaveWebMapDialog,
    getDownloadJobsFromLocalStorage,
    getPreferredReferenceLayerLocale,
} from '../utils/LocalStorage';
import {
    ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS,
    AnimationModeState,
    DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS,
    initialAnimationModeState,
} from './AnimationMode/reducer';

//npm install helper-toolkit-ts
import { miscFns } from 'helper-toolkit-ts';
import {
    DownloadModeState,
    initialDownloadModeState,
    DownloadJob,
} from './DownloadMode/reducer';
import { isAnonymouns } from '@utils/Esri-OAuth';
import { ReferenceLayerLanguage } from '@constants/map';
import { IS_MOBILE } from '@constants/UI';
import { getPreloadedState4UpdatesMode } from './UpdatesMode/getPreloadedState';
import { getRandomInterestingPlace } from '@utils/interesting-places';

// const isMobile = miscFns.isMobileDevice();

const getPreloadedState4UI = (urlParams: IURLParamData): UIState => {
    const { isDownloadDialogOpen } = urlParams;

    let activeDialog: AppDialogName | null = null;

    if (getShouldOpenSaveWebMapDialog() && isAnonymouns() === false) {
        activeDialog = 'save';
    } else if (isDownloadDialogOpen) {
        activeDialog = 'download-tile-package';
    }

    const state: UIState = {
        ...initialUIState,
        activeDialog,
    };

    return state;
};

const getPreloadedState4WaybackItems = (
    waybackItems: IWaybackItem[],
    urlParams: IURLParamData
): WaybackItemsState => {
    const { rNum4SelectedWaybackItems, rNum4ActiveWaybackItem } = urlParams;

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
        releaseNum4SelectedItems: rNum4SelectedWaybackItems || [],
        releaseNum4ActiveWaybackItem:
            rNum4ActiveWaybackItem || allReleaseNumbers[0],
    };

    return state;
};

const getPreloadedState4SwipeView = (
    urlParams: IURLParamData,
    waybackItems: IWaybackItem[]
): SwipeViewState => {
    const {
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer,
        rNum4SwipeWidgetTrailingLayer,
        rNum4ActiveWaybackItem,
    } = urlParams;

    const state: SwipeViewState = {
        ...initialSwipeViewState,
        releaseNum4LeadingLayer:
            rNum4SwipeWidgetLeadingLayer ||
            rNum4ActiveWaybackItem ||
            waybackItems[0].releaseNum,
        releaseNum4TrailingLayer:
            rNum4SwipeWidgetTrailingLayer ||
            waybackItems[waybackItems.length - 1].releaseNum,
    };

    return state;
};

const getPreloadedState4Map = (urlParams: IURLParamData): MapState => {
    const { mapExtent, animationSpeed, isSwipeWidgetOpen } = urlParams;

    let initialMapCenter = getMapCenterFromHashParams();

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

    let mode: MapMode = getMapModeFromHashParams();

    if (isSwipeWidgetOpen) {
        mode = 'swipe';
    } else if (animationSpeed !== null) {
        mode = 'animation';
    }

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
        referenceLayerLocale: getPreferredReferenceLayerLocale() || null, //ReferenceLayerLanguage.English,
    };

    return state;
};

const getPreloadedState4AnimationMode = (
    urlParams: IURLParamData
): AnimationModeState => {
    let { animationSpeed } = urlParams;
    const { rNum4FramesToExclude } = urlParams;

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
    urlParams: IURLParamData
): DownloadModeState => {
    const { isDownloadDialogOpen } = urlParams;

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
        // isDownloadDialogOpen,
        jobs: {
            byId,
            ids,
        },
    };

    return state;
};

const getPreloadedState = async (
    waybackItems: IWaybackItem[]
): Promise<PartialRootState> => {
    const urlParams: IURLParamData = decodeURLParams();

    const preloadedState = {
        UI: getPreloadedState4UI(urlParams),
        WaybackItems: getPreloadedState4WaybackItems(waybackItems, urlParams),
        SwipeView: getPreloadedState4SwipeView(urlParams, waybackItems),
        Map: getPreloadedState4Map(urlParams),
        AnimationMode: getPreloadedState4AnimationMode(urlParams),
        DownloadMode: getPreloadedState4Downloadmode(urlParams),
        UpdatesMode: getPreloadedState4UpdatesMode(),
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
