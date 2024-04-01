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

import { initialUIState, UIState } from './UI/reducer';
import { initialWaybackItemsState, WaybackItemsState } from './Wayback/reducer';
import { initialSwipeViewState, SwipeViewState } from './Swipe/reducer';
import { IURLParamData, IWaybackItem } from '../types';
import { initialMapState, MapMode, MapState } from './Map/reducer';
import {
    decodeURLParams,
    getMapCenterFromHashParams,
} from '../utils/UrlSearchParam';

import {
    // getDefaultExtent,
    // getCustomPortalUrl,
    // getShouldShowUpdatesWithLocalChanges,
    getShouldOpenSaveWebMapDialog,
    getDownloadJobsFromLocalStorage,
} from '../utils/LocalStorage';
import {
    ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS,
    AnimationModeState,
    DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS,
    // DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS,
    initialAnimationModeState,
} from './AnimationMode/reducer';

import { miscFns } from 'helper-toolkit-ts';
import {
    DownloadModeState,
    initialDownloadModeState,
} from './DownloadMode/reducer';
import { isAnonymouns } from '@utils/Esri-OAuth';

const isMobile = miscFns.isMobileDevice();

const getPreloadedState4UI = (urlParams: IURLParamData): UIState => {
    const state: UIState = {
        ...initialUIState,
        // shouldOnlyShowItemsWithLocalChange,
        isSaveAsWebmapDialogOpen:
            getShouldOpenSaveWebMapDialog() && isAnonymouns() === false,
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
        // isSwipeWidgetOpen,
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

    const { center, zoom } = getMapCenterFromHashParams() || {};

    let mode: MapMode = 'explore';

    if (isSwipeWidgetOpen) {
        mode = 'swipe';
    } else if (animationSpeed) {
        mode = 'animation';
    }

    const state: MapState = {
        ...initialMapState,
        mode,
        mapExtent,
        center,
        zoom,
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
        isMobile
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
        // isAnimationModeOn: true,
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

    const jobs = getDownloadJobsFromLocalStorage();
    console.log(jobs);

    const byId = {};
    const ids = [];

    for (const job of jobs) {
        const { id } = job;
        byId[id] = job;
        ids.push(id);
    }

    const state: DownloadModeState = {
        ...initialDownloadModeState,
        isDownloadDialogOpen,
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

    // const uiState: UIState = getPreloadedState4UI(urlParams);

    // const waybackItemsState: WaybackItemsState = getPreloadedState4WaybackItems(
    //     waybackItems,
    //     urlParams
    // );
    // const swipeViewState: SwipeViewState = getPreloadedState4SwipeView(
    //     urlParams,
    //     waybackItems
    // );
    // const mapState: MapState = getPreloadedState4Map(urlParams);

    // const animationModeState: AnimationModeState =
    //     getPreloadedState4AnimationMode(urlParams);

    const preloadedState = {
        UI: getPreloadedState4UI(urlParams),
        WaybackItems: getPreloadedState4WaybackItems(waybackItems, urlParams),
        SwipeView: getPreloadedState4SwipeView(urlParams, waybackItems),
        Map: getPreloadedState4Map(urlParams),
        AnimationMode: getPreloadedState4AnimationMode(urlParams),
        DownloadMode: getPreloadedState4Downloadmode(urlParams),
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
