import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
import { batch } from 'react-redux';

export type DownloadModeState = {
    isDownloadDialogOpen: boolean;
};

export const initialDownloadModeState = {
    isDownloadDialogOpen: false,
} as DownloadModeState;

const slice = createSlice({
    name: 'Download',
    initialState: initialDownloadModeState,
    reducers: {
        isDownloadDialogOpenToggled: (state) => {
            state.isDownloadDialogOpen = !state.isDownloadDialogOpen;
        },
    },
});

const { reducer } = slice;

export const { isDownloadDialogOpenToggled } = slice.actions;

export const selectIsDownloadDialogOpen = createSelector(
    (state: RootState) => state.DownloadMode.isDownloadDialogOpen,
    (isDownloadDialogOpen) => isDownloadDialogOpen
);

export const addToDownloadList =
    (releaseNumber: number) =>
    (
        dispatch: StoreDispatch
        // getState: StoreGetState
    ) => {
        batch(() => {
            dispatch(isDownloadDialogOpenToggled());
        });
    };

export default reducer;
