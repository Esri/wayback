import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../../configureStore';
import { batch } from 'react-redux';
import { IExtent } from '@esri/arcgis-rest-request';

export type DownloadJob = {
    /**
     * unique identifier of this download job
     */
    id: string;
    /**
     * wayback release number for this download job
     */
    releaseNum: number;
    /**
     * map extent of this download job
     */
    extent: IExtent;
    /**
     * This download job has a minimum zoom level. We use the zoom level of the map when user creates this job as the minimum zoom level .
     * Users are not allowed to select a zoom level lower than the minZoomLevel.
     * For example, if the user's current zoom level is 12, they can only choose zoom levels 12 and above (12-16), but not 10-16.
     */
    minZoomLevel: number;
    /**
     * This download job has a predefined maximum zoom level. The maximum zoom level will be determined based on the `minZoomLevel`.
     * There is an upper limit on the total number of tiles (e.g., 150,000) that can be included in each download job.
     * The `maxZoomLevel` helps us ensure that the user does not submit a job that would exceed that limit.
     */
    maxZoomLevel: number;
    /**
     * user selected zoom levels of this donwload job
     */
    levels: number[];
    /**
     * status of this download job
     */
    status: 'pending' | 'finished' | '';
    /**
     * unix timestamp of when this job was created
     */
    createdTime: number;
    /**
     * an estimation of total number of tiles that will be included in the bundle
     */
    totalTiles?: number;
};

export type DownloadModeState = {
    jobs: {
        byId: {
            [key: string]: DownloadJob;
        };
        ids: string[];
    };
    isDownloadDialogOpen: boolean;
};

export const initialDownloadModeState = {
    jobs: {
        byId: {},
        ids: [],
    },
    isDownloadDialogOpen: false,
} as DownloadModeState;

const slice = createSlice({
    name: 'Download',
    initialState: initialDownloadModeState,
    reducers: {
        isDownloadDialogOpenToggled: (state) => {
            state.isDownloadDialogOpen = !state.isDownloadDialogOpen;
        },
        downloadJobCreated: (state, action: PayloadAction<DownloadJob>) => {
            const { id } = action.payload;
            state.jobs.byId[id] = action.payload;
            state.jobs.ids = [id, ...state.jobs.ids];
        },
    },
});

const { reducer } = slice;

export const { isDownloadDialogOpenToggled, downloadJobCreated } =
    slice.actions;

export default reducer;
