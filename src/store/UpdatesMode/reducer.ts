import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
import {
    ImageryUpdatesStatus,
    ImageryUpdatesCategory,
} from '@services/world-imagery-updates/config';

type UpdatesModeDateFilter =
    | 'last-week'
    | 'last-month'
    | 'last-3-months'
    | 'last-6-months'
    | 'last-year-and-pending'
    | 'custom';

export type UpdatesModeState = {
    /**
     * selected status for imagery updates
     * - `pending`: Imagery updates that are not yet published.
     * - `published`: Imagery updates that have been published.
     */
    status: ImageryUpdatesStatus[];
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
     * date range filter for imagery updates
     */
    dateRange: UpdatesModeDateFilter;
};

export const initialUpdatesModeState: UpdatesModeState = {
    status: ['published', 'pending'],
    category: 'vivid-advanced',
    region: '',
    allRegions: [],
    dateRange: 'last-year-and-pending',
};

export const updatesModeSlice = createSlice({
    name: 'updatesMode',
    initialState: initialUpdatesModeState,
    reducers: {
        updatesModeStatusChanged: (
            state,
            action: PayloadAction<ImageryUpdatesStatus[]>
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
        updatesModeDateRangeChanged: (
            state,
            action: PayloadAction<UpdatesModeDateFilter>
        ) => {
            state.dateRange = action.payload;
        },
    },
});

const { reducer } = updatesModeSlice;

export const {
    updatesModeStatusChanged,
    updatesModeCategoryChanged,
    updatesModeRegionChanged,
    allRegionsChanged,
    updatesModeDateRangeChanged,
} = updatesModeSlice.actions;

export default reducer;
