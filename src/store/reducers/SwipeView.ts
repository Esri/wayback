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
    releaseNum4LeadingLayer: number;
    releaseNum4TrailingLayer: number;
    swipePosition: number;
};

export const initialSwipeViewState = {
    isSwipeWidgetOpen: false,
    releaseNum4LeadingLayer: null,
    releaseNum4TrailingLayer: null,
    swipePosition: 50
} as SwipeViewState;

const slice = createSlice({
    name: 'SwipeView',
    initialState: initialSwipeViewState,
    reducers: {
        isSwipeWidgetOpenToggled: (state:SwipeViewState) => {
            state.isSwipeWidgetOpen = !state.isSwipeWidgetOpen;
        },
        releaseNum4LeadingLayerUpdated: (state:SwipeViewState, action:PayloadAction<number>)=>{
            state.releaseNum4LeadingLayer = action.payload;
        },
        releaseNum4TrailingLayerUpdated: (state:SwipeViewState, action:PayloadAction<number>)=>{
            state.releaseNum4TrailingLayer = action.payload;
        },
        swipePositionUpdated: (state:SwipeViewState, action:PayloadAction<number>)=>{
            state.swipePosition = action.payload;
        }
    },
});

const { reducer } = slice;

export const { 
    isSwipeWidgetOpenToggled,
    releaseNum4LeadingLayerUpdated,
    releaseNum4TrailingLayerUpdated
} = slice.actions;

export const isSwipeWidgetOpenSelector = createSelector(
    (state: RootState) => state.SwipeView.isSwipeWidgetOpen,
    (isSwipeWidgetOpen) => isSwipeWidgetOpen
);

export const releaseNum4LeadingLayerSelector = createSelector(
    (state: RootState) => state.SwipeView.releaseNum4LeadingLayer,
    (releaseNum4LeadingLayer) => releaseNum4LeadingLayer
);

export const releaseNum4TrailingLayerSelector = createSelector(
    (state: RootState) => state.SwipeView.releaseNum4TrailingLayer,
    (releaseNum4TrailingLayer) => releaseNum4TrailingLayer
);

export const swipePositionSelector = createSelector(
    (state: RootState) => state.SwipeView.swipePosition,
    (swipePosition) => swipePosition
);

export default reducer;