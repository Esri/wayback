import { PartialRootState } from './configureStore';

import { initialUIState, UIState } from './UI/reducer';
import { initialWaybackItemsState, WaybackItemsState } from './Wayback/reducer';
import { initialSwipeViewState, SwipeViewState } from './Swipe/reducer';
import { IURLParamData, IWaybackItem } from '../types';
import { initialMapState, MapState } from './Map/reducer';
import {
    decodeURLParams,
    getMapCenterFromHashParams,
} from '../utils/UrlSearchParam';

import {
    // getDefaultExtent,
    // getCustomPortalUrl,
    getShouldShowUpdatesWithLocalChanges,
    getShouldOpenSaveWebMapDialog,
    getDownloadJobsFromLocalStorage,
} from '../utils/LocalStorage';
import {
    AnimationModeState,
    DEFAULT_ANIMATION_SPEED_IN_SECONDS,
    initialAnimationModeState,
} from './AnimationMode/reducer';

import { miscFns } from 'helper-toolkit-ts';
import {
    DownloadModeState,
    initialDownloadModeState,
} from './DownloadMode/reducer';

const isMobile = miscFns.isMobileDevice();

const getPreloadedState4UI = (urlParams: IURLParamData): UIState => {
    const shouldOnlyShowItemsWithLocalChange =
        urlParams.shouldOnlyShowItemsWithLocalChange ||
        getShouldShowUpdatesWithLocalChanges();

    const state: UIState = {
        ...initialUIState,
        shouldOnlyShowItemsWithLocalChange,
        isSaveAsWebmapDialogOpen: getShouldOpenSaveWebMapDialog(),
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
        isSwipeWidgetOpen,
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
    const { mapExtent } = urlParams;

    const { center, zoom } = getMapCenterFromHashParams() || {};

    const state: MapState = {
        ...initialMapState,
        mapExtent,
        center,
        zoom,
    };

    return state;
};

const getPreloadedState4AnimationMode = (
    urlParams: IURLParamData
): AnimationModeState => {
    const { animationSpeed, rNum4FramesToExclude } = urlParams;

    if (
        animationSpeed === null ||
        typeof animationSpeed !== 'number' ||
        isMobile
    ) {
        return initialAnimationModeState;
    }

    const state: AnimationModeState = {
        ...initialAnimationModeState,
        isAnimationModeOn: true,
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
