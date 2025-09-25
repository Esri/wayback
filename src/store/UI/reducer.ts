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

export type AppDialogName =
    | 'about'
    | 'setting'
    | 'save'
    | 'download-tile-package';

export type UIState = {
    // isSaveAsWebmapDialogOpen: boolean;
    shouldOnlyShowItemsWithLocalChange: boolean;
    shouldShowPreviewItemTitle: boolean;
    // isGutterHide: boolean;
    isSideBarHide: boolean;
    // isShareModalOpen: boolean;
    // isAboutThisAppModalOpen: boolean;
    // isSettingModalOpen: boolean;
    /**
     * Whether the user profile card is open or not
     */
    isUserProfileCardOpen: boolean;
    /**
     * The name of the currently active dialog (if any)
     */
    activeDialog: AppDialogName | null;
};

export const initialUIState = {
    // isSaveAsWebmapDialogOpen: false,
    shouldOnlyShowItemsWithLocalChange: true,
    shouldShowPreviewItemTitle: false,
    // isGutterHide: false,
    isSideBarHide: false,
    // isShareModalOpen: false,
    isAboutThisAppModalOpen: false,
    isSettingModalOpen: false,
    isUserProfileCardOpen: false,
    activeDialog: null,
} as UIState;

const slice = createSlice({
    name: 'UI',
    initialState: initialUIState,
    reducers: {
        isSaveAsWebmapDialogOpenToggled: (state) => {
            // state.isSaveAsWebmapDialogOpen = !state.isSaveAsWebmapDialogOpen;
            state.activeDialog = state.activeDialog === 'save' ? null : 'save';
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
        // isGutterHideToggled: (state) => {
        //     state.isGutterHide = !state.isGutterHide;
        // },
        isSideBarHideToggled: (state) => {
            state.isSideBarHide = !state.isSideBarHide;
        },
        // isShareModalOpenToggled: (state) => {
        //     state.isShareModalOpen = !state.isShareModalOpen;
        // },
        isAboutThisAppModalOpenToggled: (state) => {
            // state.isAboutThisAppModalOpen = !state.isAboutThisAppModalOpen;
            state.activeDialog =
                state.activeDialog === 'about' ? null : 'about';
        },
        isSettingModalOpenToggled: (state) => {
            // state.isSettingModalOpen = !state.isSettingModalOpen;
            state.activeDialog =
                state.activeDialog === 'setting' ? null : 'setting';
        },
        userProfileCardOpenToggled: (state, action: PayloadAction<boolean>) => {
            state.isUserProfileCardOpen =
                typeof action.payload === 'boolean'
                    ? action.payload
                    : !state.isUserProfileCardOpen;
        },
        activeDialogUpdated: (
            state,
            action: PayloadAction<AppDialogName | null>
        ) => {
            state.activeDialog = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    isSaveAsWebmapDialogOpenToggled,
    shouldOnlyShowItemsWithLocalChangeToggled,
    shouldShowPreviewItemTitleToggled,
    // isGutterHideToggled,
    isSideBarHideToggled,
    // isShareModalOpenToggled,
    isAboutThisAppModalOpenToggled,
    isSettingModalOpenToggled,
    userProfileCardOpenToggled,
    activeDialogUpdated,
} = slice.actions;

export const isSaveAsWebmapDialogOpenSelector = (state: RootState) =>
    state.UI.activeDialog === 'save';

export const shouldOnlyShowItemsWithLocalChangeSelector = (state: RootState) =>
    state.UI.shouldOnlyShowItemsWithLocalChange;

export const shouldShowPreviewItemTitleSelector = (state: RootState) =>
    state.UI.shouldShowPreviewItemTitle;

// export const isGutterHideSelector = (state: RootState) => state.UI.isGutterHide;

export const isSideBarHideSelector = (state: RootState) =>
    state.UI.isSideBarHide;

// export const isShareModalOpenSelector = (state: RootState) =>
//     state.UI.isShareModalOpen;

export const isAboutThisAppModalOpenSelector = (state: RootState) =>
    state.UI.activeDialog === 'about';

export const isSettingModalOpenSelector = (state: RootState) =>
    state.UI.activeDialog === 'setting';

export const isUserProfileCardOpenSelector = (state: RootState) =>
    state.UI.isUserProfileCardOpen;

export const activeDialogSelector = (state: RootState) => state.UI.activeDialog;

export default reducer;
