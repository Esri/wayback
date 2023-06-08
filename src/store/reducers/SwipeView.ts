import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
// import { IWaybackItem } from '@typings/index';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import { toggleAnimationMode } from './AnimationMode';

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
    swipePosition: 50,
} as SwipeViewState;

const slice = createSlice({
    name: 'SwipeView',
    initialState: initialSwipeViewState,
    reducers: {
        isSwipeWidgetOpenToggled: (state: SwipeViewState) => {
            state.isSwipeWidgetOpen = !state.isSwipeWidgetOpen;
        },
        releaseNum4LeadingLayerUpdated: (
            state: SwipeViewState,
            action: PayloadAction<number>
        ) => {
            state.releaseNum4LeadingLayer = action.payload;
        },
        releaseNum4TrailingLayerUpdated: (
            state: SwipeViewState,
            action: PayloadAction<number>
        ) => {
            state.releaseNum4TrailingLayer = action.payload;
        },
        swipePositionUpdated: (
            state: SwipeViewState,
            action: PayloadAction<number>
        ) => {
            state.swipePosition = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    isSwipeWidgetOpenToggled,
    releaseNum4LeadingLayerUpdated,
    releaseNum4TrailingLayerUpdated,
    swipePositionUpdated,
} = slice.actions;

export const toggleSwipeWidget =
    () => (dispatch: StoreDispatch, getState: StoreGetState) => {
        const { AnimationMode } = getState();

        if (AnimationMode.isAnimationModeOn) {
            dispatch(toggleAnimationMode());
        }

        dispatch(isSwipeWidgetOpenToggled());
    };

export const isSwipeWidgetOpenSelector = createSelector(
    (state: RootState) => state.SwipeView.isSwipeWidgetOpen,
    (isSwipeWidgetOpen) => isSwipeWidgetOpen
);

export const swipeWidgetLeadingLayerSelector = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (state: RootState) => state.SwipeView.releaseNum4LeadingLayer,
    (byReleaseNumber, releaseNum4LeadingLayer) =>
        byReleaseNumber[releaseNum4LeadingLayer]
);

export const swipeWidgetTrailingLayerSelector = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (state: RootState) => state.SwipeView.releaseNum4TrailingLayer,
    (byReleaseNumber, releaseNum4TrailingLayer) =>
        byReleaseNumber[releaseNum4TrailingLayer]
);

export const swipePositionSelector = createSelector(
    (state: RootState) => state.SwipeView.swipePosition,
    (swipePosition) => swipePosition
);

export default reducer;
