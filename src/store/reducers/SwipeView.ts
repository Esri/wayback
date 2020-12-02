import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { IWaybackItem } from '../../types';
import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type SwipeViewState = {
    isSwipeWidgetOpen: boolean;
    swipeWidgetLeadingLayer: IWaybackItem;
    swipeWidgetTrailingLayer: IWaybackItem;
    swipePosition: number;
};

export const initialSwipeViewState = {
    isSwipeWidgetOpen: false,
    swipeWidgetLeadingLayer: null,
    swipeWidgetTrailingLayer: null,
    swipePosition: 50
} as SwipeViewState;

const slice = createSlice({
    name: 'SwipeView',
    initialState: initialSwipeViewState,
    reducers: {
        isSwipeWidgetOpenToggled: (state:SwipeViewState) => {
            state.isSwipeWidgetOpen = !state.isSwipeWidgetOpen;
        },
        swipeWidgetLeadingLayerUpdated: (state:SwipeViewState, action:PayloadAction<IWaybackItem>)=>{
            state.swipeWidgetLeadingLayer = action.payload;
        },
        swipeWidgetTrailingLayerUpdated: (state:SwipeViewState, action:PayloadAction<IWaybackItem>)=>{
            state.swipeWidgetTrailingLayer = action.payload;
        },
        swipePositionUpdated: (state:SwipeViewState, action:PayloadAction<number>)=>{
            state.swipePosition = action.payload;
        }
    },
});

const { reducer } = slice;

export const { 
    isSwipeWidgetOpenToggled,
    swipeWidgetLeadingLayerUpdated,
    swipeWidgetTrailingLayerUpdated
} = slice.actions;

export const isSwipeWidgetOpenSelector = createSelector(
    (state: RootState) => state.SwipeView.isSwipeWidgetOpen,
    (isSwipeWidgetOpen) => isSwipeWidgetOpen
);

export const swipeWidgetLeadingLayerSelector = createSelector(
    (state: RootState) => state.SwipeView.swipeWidgetLeadingLayer,
    (swipeWidgetLeadingLayer) => swipeWidgetLeadingLayer
);

export const swipeWidgetTrailingLayerSelector = createSelector(
    (state: RootState) => state.SwipeView.swipeWidgetTrailingLayer,
    (swipeWidgetTrailingLayer) => swipeWidgetTrailingLayer
);

export const swipePositionSelector = createSelector(
    (state: RootState) => state.SwipeView.swipePosition,
    (swipePosition) => swipePosition
);

export default reducer;