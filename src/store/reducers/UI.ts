import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type UIState = {
    isSaveAsWebmapDialogVisible: boolean;
    shouldOnlyShowItemsWithLocalChange: boolean;
    shouldShowPreviewItemTitle: boolean;
    isGutterHide: boolean;
    isSideBarHide: boolean;
};

export const initialUIState = {
    isSaveAsWebmapDialogVisible: false,
    shouldOnlyShowItemsWithLocalChange: false,
    shouldShowPreviewItemTitle: false,
    isGutterHide: false,
    isSideBarHide: false
} as UIState;

const slice = createSlice({
    name: 'UI',
    initialState: initialUIState,
    reducers: {
        isSaveAsWebmapDialogVisibleToggled: (state) => {
            state.isSaveAsWebmapDialogVisible = !state.isSaveAsWebmapDialogVisible;
        },
        shouldOnlyShowItemsWithLocalChangeToggled: (state) => {
            state.shouldOnlyShowItemsWithLocalChange = !state.shouldOnlyShowItemsWithLocalChange;
        },
        shouldShowPreviewItemTitleToggled: (state) => {
            state.shouldShowPreviewItemTitle = !state.shouldShowPreviewItemTitle;
        },
        isGutterHideToggled: (state) => {
            state.isGutterHide = !state.isGutterHide;
        },
        isSideBarHideToggled: (state) => {
            state.isSideBarHide = !state.isSideBarHide;
        },
    },
});

const { reducer } = slice;

export const { 
    isSaveAsWebmapDialogVisibleToggled,
    shouldOnlyShowItemsWithLocalChangeToggled,
    shouldShowPreviewItemTitleToggled,
    isGutterHideToggled,
    isSideBarHideToggled
} = slice.actions;

export const isSaveAsWebmapDialogVisibleSelector = createSelector(
    (state: RootState) => state.UI.isSaveAsWebmapDialogVisible,
    (isSaveAsWebmapDialogVisible) => isSaveAsWebmapDialogVisible
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

export default reducer;
