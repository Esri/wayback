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
// import { batch } from 'react-redux';
// import { IWaybackItem } from '@typings/index';
// import { saveAnimationSpeedInURLQueryParam } from '@utils/UrlSearchParam';
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
    /**
     * array of release numbers for items to be excluded from the animation
     */
    rNum2Exclude: number[];
    /**
     * animation speed in milliseconds
     */
    animationSpeed: number;
    /**
     * release number of wayback item that is being displayed as current animation frame
     */
    releaseNumberOfActiveAnimationFrame: number;
    /**
     * if true, the link of the current animiation has been copied to the clipboard
     */
    animationLinkIsCopied: boolean;
};

/**
 * list of animation speed in milliseconds
 */
export const ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS = [
    2000, 1000, 800, 600, 400, 200, 100, 20, 0,
];

export const DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS =
    ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS[
        Math.floor(ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS.length / 2)
    ];

export const initialAnimationModeState = {
    animationStatus: null,
    showDownloadAnimationPanel: false,
    waybackItems4Animation: [],
    rNum2Exclude: [],
    animationSpeed: DEFAULT_ANIMATION_SPEED_IN_MILLISECONDS,
    releaseNumberOfActiveAnimationFrame: null,
    animationLinkIsCopied: false,
} as AnimationModeState;

const slice = createSlice({
    name: 'AnimationMode',
    initialState: initialAnimationModeState,
    reducers: {
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
        animationLinkIsCopiedChanged: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.animationLinkIsCopied = action.payload;
        },
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
    animationLinkIsCopiedChanged,
} = slice.actions;

export const toggleAnimationMode =
    () => (dispatch: StoreDispatch, getState: StoreGetState) => {
        const mode = selectMapMode(getState());

        const newMode: MapMode = mode === 'animation' ? 'explore' : 'animation';

        dispatch(mapModeChanged(newMode));
    };

export const selectAnimationStatus = (state: RootState) =>
    state.AnimationMode.animationStatus;

export const selectIsAnimationPlaying = createSelector(
    (state: RootState) => state.AnimationMode.animationStatus,
    (state: RootState) => state.Map.mode,
    (animationStatus, mapMode) =>
        animationStatus !== null && mapMode === 'animation'
);

export const isAnimationModeOnSelector = (state: RootState) =>
    state.Map.mode === 'animation';

export const selectShouldShowDownloadPanel = (state: RootState) =>
    state.AnimationMode.showDownloadAnimationPanel;

export const rNum2ExcludeSelector = (state: RootState) =>
    state.AnimationMode.rNum2Exclude;

export const animationSpeedSelector = (state: RootState) =>
    state.AnimationMode.animationSpeed;

export const selectReleaseNumberOfActiveAnimationFrame = (state: RootState) =>
    state.AnimationMode.releaseNumberOfActiveAnimationFrame;

export const selectAnimationLinkIsCopied = (state: RootState) =>
    state.AnimationMode.animationLinkIsCopied;

export default reducer;
