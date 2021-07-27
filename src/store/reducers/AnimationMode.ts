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
    rNum4AnimationFrames: number[],
    rNum2Exclude: number[]
};

export const initialAnimationModeState = {
    isAnimationModeOn: false,
    rNum4AnimationFrames: [],
    rNum2Exclude: []
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
        },
        rNum2ExcludeToggled: (state:AnimationModeState, action:PayloadAction<number>)=>{

            const rNum = action.payload;

            const idx = state.rNum2Exclude.indexOf(rNum);

            if(idx === -1){
                state.rNum2Exclude.push(rNum)
            } else {
                state.rNum2Exclude.splice(idx, 1);
            }
        },
        rNum2ExcludeReset: (state:AnimationModeState)=>{
            state.rNum2Exclude = []
        }
    },
});

const { reducer } = slice;

export const {
    isAnimationModeOnToggled,
    rNum4AnimationFramesLoaded,
    rNum2ExcludeToggled,
    rNum2ExcludeReset
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


export const rNum2ExcludeSelector = createSelector(
    (state: RootState) => state.AnimationMode.rNum2Exclude,
    (rNum2Exclude) => rNum2Exclude
);

export default reducer;
