import { PartialRootState } from './configureStore';

import { initialUIState, UIState } from '../store/reducers/UI';
import { initialWaybackItemsState, WaybackItemsState } from '../store/reducers/WaybackItems';
import { initialSwipeViewState, SwipeViewState } from '../store/reducers/SwipeView';
import { ISearchParamData, IWaybackItem } from '../types';
import { initialMapState, MapState } from './reducers/Map';

const getPreloadedState4UI = (searchParams:ISearchParamData): UIState => {
    const {
        shouldOnlyShowItemsWithLocalChange
    } = searchParams;

    const state:UIState = {
        ...initialUIState,
        shouldOnlyShowItemsWithLocalChange
    };

    return state;
};

const getPreloadedState4WaybackItems = (waybackItems:IWaybackItem[], searchParams:ISearchParamData): WaybackItemsState => {

    const {
        rNum4SelectedWaybackItems,
        rNum4ActiveWaybackItem
    } = searchParams;

    const byReleaseNumber: { 
        [key:number]: IWaybackItem 
    } = {};

    const allReleaseNumbers:number[] = [];

    waybackItems.forEach(item=>{
        const { releaseNum } = item;
        byReleaseNumber[releaseNum] = item;
        allReleaseNumbers.push(releaseNum);
    });

    const state:WaybackItemsState = {
        ...initialWaybackItemsState,
        byReleaseNumber,
        allReleaseNumbers,
        releaseNum4SelectedItems: rNum4SelectedWaybackItems || [],
        releaseNum4ActiveWaybackItem: rNum4ActiveWaybackItem || allReleaseNumbers[0]
    };

    return state;
};

const getPreloadedState4SwipeView = (searchParams:ISearchParamData): SwipeViewState => {

    const {
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer,
        rNum4SwipeWidgetTrailingLayer
    } = searchParams;

    const state:SwipeViewState = {
        ...initialSwipeViewState,
        isSwipeWidgetOpen,
        releaseNum4LeadingLayer: rNum4SwipeWidgetLeadingLayer,
        releaseNum4TrailingLayer: rNum4SwipeWidgetTrailingLayer
    };

    return state;
};

const getPreloadedState4Map = (searchParams:ISearchParamData): MapState => {

    const {
        mapExtent
    } = searchParams;

    const state:MapState = {
        ...initialMapState,
        mapExtent
    };

    return state;
};

const getPreloadedState = async(waybackItems:IWaybackItem[], searchParams:ISearchParamData): Promise<PartialRootState> => {

    const uiState:UIState = getPreloadedState4UI(searchParams);
    const waybackItemsState:WaybackItemsState = getPreloadedState4WaybackItems(waybackItems, searchParams);
    const swipeViewState:SwipeViewState = getPreloadedState4SwipeView(searchParams);
    const mapState:MapState = getPreloadedState4Map(searchParams);

    const preloadedState = {
        UI: uiState,
        WaybackItems: waybackItemsState,
        SwipeView: swipeViewState,
        Map: mapState
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
