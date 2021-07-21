import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
// import { IWaybackItem } from '../../types';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import {
    isSwipeWidgetOpenToggled,
} from './SwipeView';

export type AnimationModeState = {
    isAnimationModeOn: boolean;
    rNum4AnimationFrames: number[]
};

export const initialAnimationModeState = {
    isAnimationModeOn: false,
    rNum4AnimationFrames: []
} as AnimationModeState;

const slice = createSlice({
    name: 'AnimationMode',
    initialState: initialAnimationModeState,
    reducers: {
        isAnimationModeOnToggled: (state: AnimationModeState) => {
            state.isAnimationModeOn = !state.isAnimationModeOn;
        },
        rNum4AnimationFramesLoaded: (state:AnimationModeState, action:PayloadAction<number[]>)=>{
            state.rNum4AnimationFrames = action.payload
        }
    },
});

const { reducer } = slice;

export const {
    isAnimationModeOnToggled,
    rNum4AnimationFramesLoaded
} = slice.actions;

export const toggleAnimationMode = ()=>(dispatch: StoreDispatch, getState: StoreGetState)=>{
    const { SwipeView } = getState();

    if(SwipeView.isSwipeWidgetOpen){
        dispatch(isSwipeWidgetOpenToggled());
    }

    dispatch(isAnimationModeOnToggled());
}

export const isAnimationModeOnSelector = createSelector(
    (state: RootState) => state.AnimationMode.isAnimationModeOn,
    (isAnimationModeOn) => isAnimationModeOn
);

export const rNum4AnimationFramesSelector = createSelector(
    (state: RootState) => state.AnimationMode.rNum4AnimationFrames,
    (rNum4AnimationFrames) => rNum4AnimationFrames
);

export default reducer;
