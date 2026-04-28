/* Copyright 2024-2026 Esri
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
import {
    WorldImageryUpdatesStatusEnum,
    ImageryUpdatesCategory,
} from '@services/world-imagery-updates/config';

export type UpdatesModeDateFilter =
    | 'last-week'
    | 'last-month'
    | 'last-3-months'
    | 'last-6-months'
    | 'last-year'
    | 'next-week'
    | 'next-month'
    | 'next-3-months';

/**
 * The object containing the out statistics for world imagery updates grouped by status.
 */
export type WorldImageryUpdatesOutStatistics = {
    // /**
    //  * The number of pending updates.
    //  */
    // countOfPending: number;
    // /**
    //  * The number of published updates.
    //  */
    // countOfPublished: number;
    // /**
    //  * The area of pending updates in square kilometers.
    //  */
    // areaOfPending: number;
    // /**
    //  * The area of published updates in square kilometers.
    //  */
    // areaOfPublished: number;
    /**
     * The total count of updates that meet the where clause, regardless of their publication status.
     */
    count: number;
    /**
     * The total area of updates that meet the where clause in square kilometers, regardless of their publication status.
     */
    area: number;
    /**
     * A flag to indicate whether the out statistics are currently being loaded.
     */
    loading: boolean;
};

export type UpdatesModeState = {
    // /**
    //  * selected status for imagery updates
    //  * - `pending`: Imagery updates that are not yet published.
    //  * - `published`: Imagery updates that have been published.
    //  */
    // status: WorldImageryUpdatesStatusEnum[];
    /**
     * category filter for imagery updates
     * - `vivid-advanced`: Imagery updates from Vantor's Vivid Advanced basemap product.
     * - `vivid-standard`: Imagery updates from Vantor's Vivid Standard basemap product.
     * - `community-contributed`: Imagery updates contributed by the GIS User Community.
     */
    category: ImageryUpdatesCategory;
    /**
     * region filter for imagery updates, should a country or region be selected
     */
    region: string;
    /**
     * list of all regions available for imagery updates
     */
    allRegions: {
        name: string;
    }[];
    /**
     * date filter for imagery updates
     */
    dateFilter: UpdatesModeDateFilter;
    // /**
    //  * custom date range for imagery updates, should the custom date filter be selected
    //  * - `null`: No custom date range selected.
    //  * - `[string, string]`: An array containing two date strings in ISO format (YYYY-MM-DD) representing the start and end dates of the custom range.
    //  */
    // customDateRange: [string, string] | null;
    /**
     * out statistics for world imagery updates
     */
    outStatistics: WorldImageryUpdatesOutStatistics;
    /**
     * flag to indicate whether to zoom to the selected region when the region changes.
     * this is used to prevent zooming when the region is changed programmatically (e.g., when the region list is loaded),
     * should only zoom when the user selects a region from the dropdown.
     */
    shouldZoomToSelectedRegion: boolean;
    /**
     * flag to indicate whether the app is loading the extent for the selected region
     * (used to show a loading indicator in the region dropdown)
     */
    isLoadingExtentForSelectedRegion?: boolean;
};

export const initialUpdatesModeState: UpdatesModeState = {
    // status: [
    //     WorldImageryUpdatesStatusEnum.pending,
    //     WorldImageryUpdatesStatusEnum.published,
    // ],
    category: 'vivid-advanced',
    region: '',
    allRegions: [],
    dateFilter: 'last-year',
    // customDateRange: null,
    outStatistics: {
        count: 0,
        area: 0,
        loading: false,
    },
    shouldZoomToSelectedRegion: false,
    isLoadingExtentForSelectedRegion: false,
};

export const updatesModeSlice = createSlice({
    name: 'updatesMode',
    initialState: initialUpdatesModeState,
    reducers: {
        // updatesModeStatusChanged: (
        //     state,
        //     action: PayloadAction<WorldImageryUpdatesStatusEnum[]>
        // ) => {
        //     state.status = action.payload;
        // },
        updatesModeCategoryChanged: (
            state,
            action: PayloadAction<ImageryUpdatesCategory>
        ) => {
            state.category = action.payload;
        },
        updatesModeRegionChanged: (state, action: PayloadAction<string>) => {
            state.region = action.payload;
        },
        allRegionsChanged: (
            state,
            action: PayloadAction<{ name: string }[]>
        ) => {
            state.allRegions = action.payload;
        },
        updatesModeDateFilterChanged: (
            state,
            action: PayloadAction<UpdatesModeDateFilter>
        ) => {
            state.dateFilter = action.payload;
        },
        // /**
        //  * Updates the custom date range for imagery updates.
        //  * @param state - The current state of the updates mode.
        //  * @param action - The action containing the new custom date range.
        //  */
        // updatesModeCustomDateRangeChanged: (
        //     state,
        //     action: PayloadAction<[string, string] | null>
        // ) => {
        //     state.customDateRange = action.payload;
        // },
        worldImageryUpdatesOutStatisticsChanged: (
            state,
            action: PayloadAction<WorldImageryUpdatesOutStatistics>
        ) => {
            state.outStatistics = action.payload;
        },
        shouldZoomToSelectedRegionChanged: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.shouldZoomToSelectedRegion = action.payload;
        },
        isLoadingExtentForSelectedRegionChanged: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isLoadingExtentForSelectedRegion = action.payload;
        },
    },
});

const { reducer } = updatesModeSlice;

export const {
    // updatesModeStatusChanged,
    updatesModeCategoryChanged,
    updatesModeRegionChanged,
    allRegionsChanged,
    updatesModeDateFilterChanged,
    // updatesModeCustomDateRangeChanged,
    worldImageryUpdatesOutStatisticsChanged,
    shouldZoomToSelectedRegionChanged,
    isLoadingExtentForSelectedRegionChanged,
} = updatesModeSlice.actions;

export default reducer;
