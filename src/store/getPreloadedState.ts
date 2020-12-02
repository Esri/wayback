import { PartialRootState } from './configureStore';

import { initialUIState, UIState } from '../store/reducers/UI';
import { initialWaybackItemsState, WaybackItemsState } from '../store/reducers/WaybackItems';
import { initialSwipeViewState, SwipeViewState } from '../store/reducers/SwipeView';
import { IWaybackItem } from '../types';

const getPreloadedState4UI = (): UIState => {
    return {
        ...initialUIState,
    };
};

const getPreloadedState4WaybackItems = async(waybackItems:IWaybackItem[]): Promise<WaybackItemsState> => {
    
    const byReleaseNumber: { 
        [key:number]: IWaybackItem 
    } = {};

    const allReleaseNumbers:number[] = []

    waybackItems.forEach(item=>{
        const { releaseNum } = item;
        byReleaseNumber[releaseNum] = item;
        allReleaseNumbers.push(releaseNum);
    });

    return {
        ...initialWaybackItemsState,
        byReleaseNumber,
        allReleaseNumbers
    };
};

const getPreloadedState4SwipeView = async(): Promise<SwipeViewState> => {
    return {
        ...initialSwipeViewState,
    };
};

const getPreloadedState = async(waybackItems:IWaybackItem[]): Promise<PartialRootState> => {

    const uiState:UIState = getPreloadedState4UI();
    const waybackItemsState:WaybackItemsState = await getPreloadedState4WaybackItems(waybackItems);
    const swipeViewState:SwipeViewState = await getPreloadedState4SwipeView()

    const preloadedState = {
        UI: uiState,
        WaybackItems: waybackItemsState,
        SwipeView: swipeViewState
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
