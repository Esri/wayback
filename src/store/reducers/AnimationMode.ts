import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { IWaybackItem } from '../../types';
// import { IWaybackItem } from '../../types';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import {
    isSwipeWidgetOpenToggled,
} from './SwipeView';

export type AnimationModeState = {
    isAnimationModeOn: boolean;
    isDownloadGIFDialogOn: boolean;
    // rNum4AnimationFrames: number[],
    waybackItems4Animation: IWaybackItem[]
    // array of release numbers for items to be excluded from the animation
    rNum2Exclude: number[]
};

export const initialAnimationModeState = {
    isAnimationModeOn: false,
    isDownloadGIFDialogOn: false,
    // rNum4AnimationFrames: [],
    waybackItems4Animation: [],
    rNum2Exclude: []
} as AnimationModeState;

const slice = createSlice({
    name: 'AnimationMode',
    initialState: initialAnimationModeState,
    reducers: {
        isAnimationModeOnToggled: (state: AnimationModeState) => {
            state.isAnimationModeOn = !state.isAnimationModeOn;
        },
        isDownloadGIFDialogOnToggled: (state: AnimationModeState) => {
            state.isDownloadGIFDialogOn = !state.isDownloadGIFDialogOn;
        },
        // rNum4AnimationFramesLoaded: (state:AnimationModeState, action:PayloadAction<number[]>)=>{
        //     state.rNum4AnimationFrames = action.payload
        // },
        waybackItems4AnimationLoaded: (state:AnimationModeState, action:PayloadAction<IWaybackItem[]>)=>{
            state.waybackItems4Animation = action.payload
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
    isDownloadGIFDialogOnToggled,
    waybackItems4AnimationLoaded,
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

export const isDownloadGIFDialogOnSelector = createSelector(
    (state: RootState) => state.AnimationMode.isDownloadGIFDialogOn,
    (isDownloadGIFDialogOn) => isDownloadGIFDialogOn
);

export const waybackItems4AnimationSelector = createSelector(
    (state: RootState) => state.AnimationMode.waybackItems4Animation,
    (waybackItems4Animation) => waybackItems4Animation
);

export const rNum2ExcludeSelector = createSelector(
    (state: RootState) => state.AnimationMode.rNum2Exclude,
    (rNum2Exclude) => rNum2Exclude
);

export default reducer;
