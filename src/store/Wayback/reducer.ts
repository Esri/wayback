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

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import { shouldShowPreviewItemTitleToggled } from '../UI/reducer';

import { releaseNum4LeadingLayerUpdated } from '../Swipe/reducer';

import { metadataQueryResultUpdated } from '../Map/reducer';

export type WaybackItemsState = {
    byReleaseNumber: {
        [key: number]: IWaybackItem;
    };
    allReleaseNumbers: number[];
    releaseNum4SelectedItems: number[];
    releaseNum4ItemsWithLocalChanges: number[];
    releaseNum4ActiveWaybackItem: number;
    releaseNum4PreviewWaybackItem: number;
    releaseNum4AlternativePreviewWaybackItem: number;
    /**
     * if ture, it is in process of loading wayback items or items with local changes
     */
    isLoading: boolean;
};

export const initialWaybackItemsState: WaybackItemsState = {
    byReleaseNumber: {} as { [key: number]: IWaybackItem },
    allReleaseNumbers: [],
    releaseNum4SelectedItems: [],
    releaseNum4ItemsWithLocalChanges: [],
    releaseNum4ActiveWaybackItem: null,
    releaseNum4PreviewWaybackItem: null,
    releaseNum4AlternativePreviewWaybackItem: null,
    isLoading: false,
};

const slice = createSlice({
    name: 'waybackItems',
    initialState: initialWaybackItemsState,
    reducers: {
        itemsLoaded: (
            state: WaybackItemsState,
            action: PayloadAction<IWaybackItem[]>
        ) => {
            const items = action.payload;

            const byReleaseNumber: { [key: number]: IWaybackItem } = {};
            const allReleaseNumbers: number[] = [];

            for (const item of items) {
                const { releaseNum } = item;
                byReleaseNumber[releaseNum] = item;
                allReleaseNumbers.push(releaseNum);
            }

            state.byReleaseNumber = byReleaseNumber;
            state.allReleaseNumbers = allReleaseNumbers;
        },
        releaseNum4SelectedItemsAdded: (
            state: WaybackItemsState,
            action: PayloadAction<number>
        ) => {
            const releaseNum4Item2Add = action.payload;
            state.releaseNum4SelectedItems.push(releaseNum4Item2Add);
        },
        releaseNum4SelectedItemsRemoved: (
            state: WaybackItemsState,
            action: PayloadAction<number>
        ) => {
            const releaseNum4Item2Remove = action.payload;
            const index = state.releaseNum4SelectedItems.indexOf(
                releaseNum4Item2Remove
            );
            state.releaseNum4SelectedItems.splice(index, 1);
        },
        releaseNum4SelectedItemsCleaned: (state: WaybackItemsState) => {
            state.releaseNum4SelectedItems = [];
        },
        releaseNum4ItemsWithLocalChangesUpdated: (
            state: WaybackItemsState,
            action: PayloadAction<number[]>
        ) => {
            state.releaseNum4ItemsWithLocalChanges = [...action.payload];
        },
        releaseNum4ActiveWaybackItemUpdated: (
            state: WaybackItemsState,
            action: PayloadAction<number>
        ) => {
            state.releaseNum4ActiveWaybackItem = action.payload;
        },
        releaseNum4PreviewWaybackItemUpdated: (
            state: WaybackItemsState,
            action: PayloadAction<number>
        ) => {
            state.releaseNum4PreviewWaybackItem = action.payload;
        },
        releaseNum4AlternativePreviewWaybackItemUpdated: (
            state: WaybackItemsState,
            action: PayloadAction<number>
        ) => {
            state.releaseNum4AlternativePreviewWaybackItem = action.payload;
        },
        isLoadingWaybackItemsToggled: (
            state: WaybackItemsState,
            action: PayloadAction<boolean>
        ) => {
            state.isLoading = action.payload;
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
    releaseNum4AlternativePreviewWaybackItemUpdated,
    isLoadingWaybackItemsToggled,
} = slice.actions;

let delay4SetPreviewWaybackItem: NodeJS.Timeout;

export const setActiveWaybackItem =
    (releaseNumber: number) =>
    (
        dispatch: StoreDispatch
        // getState: StoreGetState
    ) => {
        batch(() => {
            dispatch(releaseNum4ActiveWaybackItemUpdated(releaseNumber));
            dispatch(releaseNum4LeadingLayerUpdated(releaseNumber));
            dispatch(metadataQueryResultUpdated(null));
        });
    };

export const toggleSelectWaybackItem =
    (releaseNumber: number) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        const { releaseNum4SelectedItems } = getState().WaybackItems;

        const isSelected = releaseNum4SelectedItems.indexOf(releaseNumber) > -1;

        isSelected
            ? dispatch(releaseNum4SelectedItemsRemoved(releaseNumber))
            : dispatch(releaseNum4SelectedItemsAdded(releaseNumber));
    };

export const setPreviewWaybackItem =
    (releaseNumber?: number, shouldShowPreviewItemTitle = false) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        clearTimeout(delay4SetPreviewWaybackItem);

        delay4SetPreviewWaybackItem = global.setTimeout(() => {
            const { allReleaseNumbers, releaseNum4ItemsWithLocalChanges } =
                getState().WaybackItems;

            // for wayback item, if that release doesn't have any changes for the given area, then it will use the tile from previous release instead,
            // therefore we need to find the alternative release number to make sure we have the tile image to display in the preview window for each release
            let releaseNum4AlternativePreviewWaybackItem: number =
                releaseNumber;

            if (
                releaseNumber &&
                releaseNum4ItemsWithLocalChanges.indexOf(releaseNumber) === -1
            ) {
                // getting a list of release numbers ordered by release dates (desc) that only includes release has changes for the given area and the input release number,
                // in this case, we are sure the release number next to the input release number in this list must be the item does come with changes, or a legit tile image
                const rNums = allReleaseNumbers.filter((rNum) => {
                    const hasLocalChange =
                        releaseNum4ItemsWithLocalChanges.indexOf(rNum) > -1;
                    return hasLocalChange || rNum === releaseNumber;
                });

                const indexOfInputRNum = rNums.indexOf(releaseNumber);

                releaseNum4AlternativePreviewWaybackItem =
                    rNums[indexOfInputRNum + 1];
            }

            batch(() => {
                dispatch(releaseNum4PreviewWaybackItemUpdated(releaseNumber));
                dispatch(
                    releaseNum4AlternativePreviewWaybackItemUpdated(
                        releaseNum4AlternativePreviewWaybackItem
                    )
                );
                dispatch(
                    shouldShowPreviewItemTitleToggled(
                        shouldShowPreviewItemTitle
                    )
                );
            });
        }, 200);
    };

export const allWaybackItemsSelector = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (state: RootState) => state.WaybackItems.allReleaseNumbers,
    (byReleaseNumber, allReleaseNumbers) => {
        return allReleaseNumbers.map((rNum) => byReleaseNumber[rNum]);
    }
);

export const activeWaybackItemSelector = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (state: RootState) => state.WaybackItems.releaseNum4ActiveWaybackItem,
    (byReleaseNumber, releaseNum4ActiveWaybackItem) =>
        byReleaseNumber[releaseNum4ActiveWaybackItem]
);

export const waybackItemsWithLocalChangesSelector = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (state: RootState) => state.WaybackItems.releaseNum4ItemsWithLocalChanges,
    (byReleaseNumber, releaseNum4ItemsWithLocalChanges) => {
        return releaseNum4ItemsWithLocalChanges.map(
            (rNum) => byReleaseNumber[rNum]
        );
    }
);

export const releaseNum4ItemsWithLocalChangesSelector = createSelector(
    (state: RootState) => state.WaybackItems.releaseNum4ItemsWithLocalChanges,
    (releaseNum4ItemsWithLocalChanges) => releaseNum4ItemsWithLocalChanges
);

export const releaseNum4SelectedItemsSelector = createSelector(
    (state: RootState) => state.WaybackItems.releaseNum4SelectedItems,
    (releaseNum4SelectedItems) => releaseNum4SelectedItems
);

export const previewWaybackItemSelector = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (state: RootState) => state.WaybackItems.releaseNum4PreviewWaybackItem,
    (byReleaseNumber, releaseNum4PreviewWaybackItem) =>
        byReleaseNumber[releaseNum4PreviewWaybackItem]
);

export const releaseNum4AlternativePreviewWaybackItemSelector = createSelector(
    (state: RootState) =>
        state.WaybackItems.releaseNum4AlternativePreviewWaybackItem,
    (releaseNum4AlternativePreviewWaybackItem) =>
        releaseNum4AlternativePreviewWaybackItem
);

export const selectWaybackItemsByReleaseNum = createSelector(
    (state: RootState) => state.WaybackItems.byReleaseNumber,
    (byReleaseNumber) => byReleaseNumber
);

export const selectIsLoadingWaybackItems = createSelector(
    (state: RootState) => state.WaybackItems.isLoading,
    (isLoading) => isLoading
);

export default reducer;
