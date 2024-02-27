/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { IWaybackItem } from '@typings/index';
import { saveAnimationSpeedInURLQueryParam } from '@utils/UrlSearchParam';
// import { IWaybackItem } from '@typings/index';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
import { MapMode, mapModeChanged, selectMapMode } from '@store/Map/reducer';

// import { isSwipeWidgetOpenToggled } from '../Swipe/reducer';

export type AnimationStatus = 'loading' | 'playing' | 'pausing';

export type AnimationModeState = {
    /**
     * status of the Animation mode
     */
    animationStatus?: AnimationStatus;
    /**
     * if true, show download animation panel
     */
    showDownloadAnimationPanel: boolean;
    // waybackItems4Animation: IWaybackItem[];
    /**
     * array of release numbers for items to be excluded from the animation
     */
    rNum2Exclude: number[];
    /**
     * animation speed in second
     */
    animationSpeed: number;
    /**
     * release number of wayback item that is being displayed as current animation frame
     */
    releaseNumberOfActiveAnimationFrame: number;
};

export const DEFAULT_ANIMATION_SPEED_IN_SECONDS = 1;

export const initialAnimationModeState = {
    animationStatus: null,
    // isAnimationModeOn: false,
    showDownloadAnimationPanel: false,
    // rNum4AnimationFrames: [],
    waybackItems4Animation: [],
    rNum2Exclude: [],
    animationSpeed: DEFAULT_ANIMATION_SPEED_IN_SECONDS,
    // isPlaying: true,
    indexOfCurrentFrame: 0,
    // isLoadingFrameData: true,
    releaseNumberOfActiveAnimationFrame: null,
} as AnimationModeState;

const slice = createSlice({
    name: 'AnimationMode',
    initialState: initialAnimationModeState,
    reducers: {
        // isAnimationModeOnToggled: (state: AnimationModeState) => {
        //     state.isAnimationModeOn = !state.isAnimationModeOn;
        // },
        animationStatusChanged: (
            state,
            action: PayloadAction<AnimationStatus>
        ) => {
            state.animationStatus = action.payload;
        },
        showDownloadAnimationPanelToggled: (
            state: AnimationModeState,
            action: PayloadAction<boolean>
        ) => {
            state.showDownloadAnimationPanel = action.payload;
        },
        // waybackItems4AnimationLoaded: (
        //     state: AnimationModeState,
        //     action: PayloadAction<IWaybackItem[]>
        // ) => {
        //     state.waybackItems4Animation = action.payload;
        // },
        rNum2ExcludeToggled: (
            state: AnimationModeState,
            action: PayloadAction<number>
        ) => {
            const rNum = action.payload;

            const idx = state.rNum2Exclude.indexOf(rNum);

            if (idx === -1) {
                state.rNum2Exclude.push(rNum);
            } else {
                state.rNum2Exclude.splice(idx, 1);
            }
        },
        rNum2ExcludeReset: (state: AnimationModeState) => {
            state.rNum2Exclude = [];
        },
        animationSpeedChanged: (
            state: AnimationModeState,
            action: PayloadAction<number>
        ) => {
            state.animationSpeed = action.payload;
        },
        releaseNumberOfActiveAnimationFrameChanged: (
            state: AnimationModeState,
            action: PayloadAction<number>
        ) => {
            state.releaseNumberOfActiveAnimationFrame = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    animationStatusChanged,
    // isAnimationModeOnToggled,
    showDownloadAnimationPanelToggled,
    // waybackItems4AnimationLoaded,
    rNum2ExcludeToggled,
    rNum2ExcludeReset,
    animationSpeedChanged,
    releaseNumberOfActiveAnimationFrameChanged,
} = slice.actions;

export const toggleAnimationMode =
    () => (dispatch: StoreDispatch, getState: StoreGetState) => {
        const mode = selectMapMode(getState());

        const newMode: MapMode = mode === 'animation' ? 'explore' : 'animation';

        dispatch(mapModeChanged(newMode));

        // const { SwipeView, AnimationMode } = getState();

        // const { isAnimationModeOn, animationSpeed } = AnimationMode;

        // const willAnimationModeBeTurnedOn = !isAnimationModeOn;

        // if (SwipeView.isSwipeWidgetOpen && willAnimationModeBeTurnedOn) {
        //     dispatch(isSwipeWidgetOpenToggled());
        // }

        // if (isAnimationModeOn) {
        //     console.log('reset animation mode');
        //     dispatch(resetAnimationMode());
        // }

        // saveAnimationSpeedInURLQueryParam(
        //     willAnimationModeBeTurnedOn,
        //     animationSpeed
        // );

        // dispatch(isAnimationModeOnToggled());
    };

export const selectAnimationStatus = createSelector(
    (state: RootState) => state.AnimationMode.animationStatus,
    (animationStatus) => animationStatus
);

export const isAnimationModeOnSelector = createSelector(
    (state: RootState) => state.Map.mode,
    (mode) => mode === 'animation'
);

export const selectShouldShowDownloadPanel = createSelector(
    (state: RootState) => state.AnimationMode.showDownloadAnimationPanel,
    (showDownloadAnimationPanel) => showDownloadAnimationPanel
);

// export const waybackItems4AnimationSelector = createSelector(
//     (state: RootState) => state.AnimationMode.waybackItems4Animation,
//     (waybackItems4Animation) => waybackItems4Animation
// );

export const rNum2ExcludeSelector = createSelector(
    (state: RootState) => state.AnimationMode.rNum2Exclude,
    (rNum2Exclude) => rNum2Exclude
);

export const animationSpeedSelector = createSelector(
    (state: RootState) => state.AnimationMode.animationSpeed,
    (animationSpeed) => animationSpeed
);

// export const isAnimationPlayingSelector = createSelector(
//     (state: RootState) => state.AnimationMode.isPlaying,
//     (isPlaying) => isPlaying
// );

// export const indexOfCurrentAnimationFrameSelector = createSelector(
//     (state: RootState) => state.AnimationMode.indexOfCurrentFrame,
//     (indexOfCurrentFrame) => indexOfCurrentFrame
// );

// export const waybackItem4CurrentAnimationFrameSelector = createSelector(
//     (state: RootState) => state.AnimationMode.indexOfCurrentFrame,
//     (state: RootState) => state.AnimationMode.waybackItems4Animation,
//     (state: RootState) => state.AnimationMode.isLoadingFrameData,
//     (indexOfCurrentFrame, waybackItems4Animation, isLoadingFrameData) => {
//         if (!waybackItems4Animation.length || isLoadingFrameData) {
//             return null;
//         }

//         return waybackItems4Animation[indexOfCurrentFrame];
//     }
// );

// export const isLoadingFrameDataSelector = createSelector(
//     (state: RootState) => state.AnimationMode.isLoadingFrameData,
//     (isLoadingFrameData) => isLoadingFrameData
// );

export const selectReleaseNumberOfActiveAnimationFrame = createSelector(
    (state: RootState) =>
        state.AnimationMode.releaseNumberOfActiveAnimationFrame,
    (releaseNumberOfActiveAnimationFrame) => releaseNumberOfActiveAnimationFrame
);

export default reducer;
