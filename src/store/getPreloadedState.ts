import { PartialRootState } from './configureStore';

import { initialUIState, UIState } from '../store/reducers/UI';
import { initialWaybackItemsState, WaybackItemsState } from '../store/reducers/WaybackItems';
import { initialSwipeViewState, SwipeViewState } from '../store/reducers/SwipeView';
import { ISearchParamData, IWaybackItem } from '../types';

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

const getPreloadedState4WaybackItems = async(waybackItems:IWaybackItem[], searchParams:ISearchParamData): Promise<WaybackItemsState> => {

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
        releaseNum4SelectedItems: rNum4SelectedWaybackItems,
        releaseNum4ActiveWaybackItem: rNum4ActiveWaybackItem
    };

    return state;
};

const getPreloadedState4SwipeView = async(searchParams:ISearchParamData): Promise<SwipeViewState> => {

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

const getPreloadedState = async(waybackItems:IWaybackItem[], searchParams:ISearchParamData): Promise<PartialRootState> => {

    const uiState:UIState = getPreloadedState4UI(searchParams);
    const waybackItemsState:WaybackItemsState = await getPreloadedState4WaybackItems(waybackItems, searchParams);
    const swipeViewState:SwipeViewState = await getPreloadedState4SwipeView(searchParams)

    const preloadedState = {
        UI: uiState,
        WaybackItems: waybackItemsState,
        SwipeView: swipeViewState
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
