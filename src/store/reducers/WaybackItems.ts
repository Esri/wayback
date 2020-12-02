import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { IWaybackItem } from '../../types';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type WaybackItemsState = {
    byReleaseNumber: {
        [key: number]: IWaybackItem
    };
    allReleaseNumbers: number[];
    releaseNum4SelectedItems: number[];
    releaseNum4ItemsWithLocalChanges: number[];
    releaseNum4ActiveWaybackItem: number;
    releaseNum4PreviewWaybackItem: number;
    releaseNum4AlternativePreviewWaybackItem: number;
};

export const initialWaybackItemsState = {
    byReleaseNumber: {},
    allReleaseNumbers: [],
    releaseNum4SelectedItems: [],
    releaseNum4ItemsWithLocalChanges: [],
    releaseNum4ActiveWaybackItem: null,
    releaseNum4PreviewWaybackItem: null,
    releaseNum4AlternativePreviewWaybackItem: null
} as WaybackItemsState;

const slice = createSlice({
    name: 'waybackItems',
    initialState: initialWaybackItemsState,
    reducers: {
        itemsLoaded: (state:WaybackItemsState, action:PayloadAction<IWaybackItem[]>) => {
            const items = action.payload;

            items.forEach(item=>{
                const { releaseNum } = item;
                state.byReleaseNumber[releaseNum] = item;
                state.allReleaseNumbers.push(releaseNum);
            });
        },
        releaseNum4SelectedItemsAdded: (state:WaybackItemsState, action:PayloadAction<number>)=>{
            const releaseNum4Item2Add = action.payload;
            state.releaseNum4SelectedItems.push(releaseNum4Item2Add);
        },
        releaseNum4SelectedItemsRemoved: (state:WaybackItemsState, action:PayloadAction<number>)=>{
            const releaseNum4Item2Remove = action.payload;
            const index = state.releaseNum4SelectedItems.indexOf(releaseNum4Item2Remove);
            state.releaseNum4SelectedItems.splice(index, 1);
        },
        releaseNum4SelectedItemsCleaned: (state:WaybackItemsState)=>{
            state.releaseNum4SelectedItems = [];
        },
        releaseNum4ItemsWithLocalChangesUpdated: (state:WaybackItemsState, action:PayloadAction<number[]>)=>{
            state.releaseNum4ItemsWithLocalChanges = [
                ...action.payload
            ];
        },
        releaseNum4ActiveWaybackItemUpdated: (state:WaybackItemsState, action:PayloadAction<number>)=>{
            state.releaseNum4ActiveWaybackItem = action.payload;
        },
        releaseNum4PreviewWaybackItemUpdated: (state:WaybackItemsState, action:PayloadAction<number>)=>{
            state.releaseNum4PreviewWaybackItem = action.payload;
        },
        releaseNum4AlternativePreviewWaybackItemUpdated: (state:WaybackItemsState, action:PayloadAction<number>)=>{
            state.releaseNum4AlternativePreviewWaybackItem = action.payload;
        },
    },
});

const { reducer } = slice;

export const {  
    releaseNum4SelectedItemsAdded,
    releaseNum4SelectedItemsRemoved,
    releaseNum4SelectedItemsCleaned,
    releaseNum4ItemsWithLocalChangesUpdated,
    releaseNum4ActiveWaybackItemUpdated,
    releaseNum4PreviewWaybackItemUpdated,
    releaseNum4AlternativePreviewWaybackItemUpdated
} = slice.actions;

// export const fullscreenMapSelector = createSelector(
//     (state: RootState) => state.UI.fullscreenMap,
//     (fullscreenMap) => fullscreenMap
// );

export default reducer;