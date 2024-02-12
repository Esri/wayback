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

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type UIState = {
    isSaveAsWebmapDialogOpen: boolean;
    shouldOnlyShowItemsWithLocalChange: boolean;
    shouldShowPreviewItemTitle: boolean;
    isGutterHide: boolean;
    isSideBarHide: boolean;
    isShareModalOpen: boolean;
    isAboutThisAppModalOpen: boolean;
    isSettingModalOpen: boolean;
};

export const initialUIState = {
    isSaveAsWebmapDialogOpen: false,
    shouldOnlyShowItemsWithLocalChange: true,
    shouldShowPreviewItemTitle: false,
    isGutterHide: false,
    isSideBarHide: false,
    isShareModalOpen: false,
    isAboutThisAppModalOpen: false,
    isSettingModalOpen: false,
} as UIState;

const slice = createSlice({
    name: 'UI',
    initialState: initialUIState,
    reducers: {
        isSaveAsWebmapDialogOpenToggled: (state) => {
            state.isSaveAsWebmapDialogOpen = !state.isSaveAsWebmapDialogOpen;
        },
        shouldOnlyShowItemsWithLocalChangeToggled: (
            state,
            action: PayloadAction<boolean>
        ) => {
            const newVal =
                typeof action.payload === 'boolean'
                    ? action.payload
                    : !state.shouldOnlyShowItemsWithLocalChange;

            state.shouldOnlyShowItemsWithLocalChange = newVal;
        },
        shouldShowPreviewItemTitleToggled: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.shouldShowPreviewItemTitle = action.payload;
        },
        isGutterHideToggled: (state) => {
            state.isGutterHide = !state.isGutterHide;
        },
        isSideBarHideToggled: (state) => {
            state.isSideBarHide = !state.isSideBarHide;
        },
        isShareModalOpenToggled: (state) => {
            state.isShareModalOpen = !state.isShareModalOpen;
        },
        isAboutThisAppModalOpenToggled: (state) => {
            state.isAboutThisAppModalOpen = !state.isAboutThisAppModalOpen;
        },
        isSettingModalOpenToggled: (state) => {
            state.isSettingModalOpen = !state.isSettingModalOpen;
        },
    },
});

const { reducer } = slice;

export const {
    isSaveAsWebmapDialogOpenToggled,
    shouldOnlyShowItemsWithLocalChangeToggled,
    shouldShowPreviewItemTitleToggled,
    isGutterHideToggled,
    isSideBarHideToggled,
    isShareModalOpenToggled,
    isAboutThisAppModalOpenToggled,
    isSettingModalOpenToggled,
} = slice.actions;

export const isSaveAsWebmapDialogOpenSelector = createSelector(
    (state: RootState) => state.UI.isSaveAsWebmapDialogOpen,
    (isSaveAsWebmapDialogOpen) => isSaveAsWebmapDialogOpen
);

export const shouldOnlyShowItemsWithLocalChangeSelector = createSelector(
    (state: RootState) => state.UI.shouldOnlyShowItemsWithLocalChange,
    (shouldOnlyShowItemsWithLocalChange) => shouldOnlyShowItemsWithLocalChange
);

export const shouldShowPreviewItemTitleSelector = createSelector(
    (state: RootState) => state.UI.shouldShowPreviewItemTitle,
    (shouldShowPreviewItemTitle) => shouldShowPreviewItemTitle
);

export const isGutterHideSelector = createSelector(
    (state: RootState) => state.UI.isGutterHide,
    (isGutterHide) => isGutterHide
);

export const isSideBarHideSelector = createSelector(
    (state: RootState) => state.UI.isSideBarHide,
    (isSideBarHide) => isSideBarHide
);

export const isShareModalOpenSelector = createSelector(
    (state: RootState) => state.UI.isShareModalOpen,
    (isShareModalOpen) => isShareModalOpen
);

export const isAboutThisAppModalOpenSelector = createSelector(
    (state: RootState) => state.UI.isAboutThisAppModalOpen,
    (isAboutThisAppModalOpen) => isAboutThisAppModalOpen
);

export const isSettingModalOpenSelector = createSelector(
    (state: RootState) => state.UI.isSettingModalOpen,
    (isSettingModalOpen) => isSettingModalOpen
);

export default reducer;
