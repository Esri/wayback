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
    | 'last-year-and-pending'
    | 'custom';

/**
 * The object containing the out statistics for world imagery updates grouped by status.
 */
export type WorldImageryUpdatesOutStatistics = {
    /**
     * The number of pending updates.
     */
    countOfPending: number;
    /**
     * The number of published updates.
     */
    countOfPublished: number;
    /**
     * The area of pending updates in square kilometers.
     */
    areaOfPending: number;
    /**
     * The area of published updates in square kilometers.
     */
    areaOfPublished: number;
};

export type UpdatesModeState = {
    /**
     * selected status for imagery updates
     * - `pending`: Imagery updates that are not yet published.
     * - `published`: Imagery updates that have been published.
     */
    status: WorldImageryUpdatesStatusEnum[];
    /**
     * category filter for imagery updates
     * - `vivid-advanced`: Imagery updates from Maxar's Vivid Advanced basemap product.
     * - `vivid-standard`: Imagery updates from Maxar's Vivid Standard basemap product.
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
    /**
     * custom date range for imagery updates, should the custom date filter be selected
     * - `null`: No custom date range selected.
     * - `[string, string]`: An array containing two date strings in ISO format (YYYY-MM-DD) representing the start and end dates of the custom range.
     */
    customDateRange: [string, string] | null;
    /**
     * out statistics for world imagery updates
     */
    outStatistics: WorldImageryUpdatesOutStatistics;
};

export const initialUpdatesModeState: UpdatesModeState = {
    status: [
        WorldImageryUpdatesStatusEnum.pending,
        WorldImageryUpdatesStatusEnum.published,
    ],
    category: 'vivid-advanced',
    region: '',
    allRegions: [],
    dateFilter: 'last-year-and-pending',
    customDateRange: null,
    outStatistics: {
        countOfPending: 0,
        countOfPublished: 0,
        areaOfPending: 0,
        areaOfPublished: 0,
    },
};

export const updatesModeSlice = createSlice({
    name: 'updatesMode',
    initialState: initialUpdatesModeState,
    reducers: {
        updatesModeStatusChanged: (
            state,
            action: PayloadAction<WorldImageryUpdatesStatusEnum[]>
        ) => {
            state.status = action.payload;
        },
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
        /**
         * Updates the custom date range for imagery updates.
         * @param state - The current state of the updates mode.
         * @param action - The action containing the new custom date range.
         */
        updatesModeCustomDateRangeChanged: (
            state,
            action: PayloadAction<[string, string] | null>
        ) => {
            state.customDateRange = action.payload;
        },
        worldImageryUpdatesOutStatisticsChanged: (
            state,
            action: PayloadAction<WorldImageryUpdatesOutStatistics>
        ) => {
            state.outStatistics = action.payload;
        },
    },
});

const { reducer } = updatesModeSlice;

export const {
    updatesModeStatusChanged,
    updatesModeCategoryChanged,
    updatesModeRegionChanged,
    allRegionsChanged,
    updatesModeDateFilterChanged,
    updatesModeCustomDateRangeChanged,
    worldImageryUpdatesOutStatisticsChanged,
} = updatesModeSlice.actions;

export default reducer;
