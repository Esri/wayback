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

// import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
// import { batch } from 'react-redux';
import { IExtent } from '@typings/index';
import { IWaybackItem } from '@typings/index';
import { TileEstimation } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import { id } from 'date-fns/locale';

export type DownloadJobStatus =
    | 'not started'
    | 'waiting to start'
    | 'pending'
    | 'finished'
    | 'failed'
    | 'downloaded';

export type DownloadJob = {
    /**
     * unique identifier of this download job
     */
    id: string;
    // /**
    //  * wayback release number for this download job
    //  */
    // releaseNum: number;
    /**
     * wayback item associated with this download job
     */
    waybackItem: IWaybackItem;
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
     * estimations of number of tiles that can be included in the output bundle
     */
    tileEstimations: TileEstimation[];
    /**
     * status of this download job
     */
    status: DownloadJobStatus;
    /**
     * unix timestamp of when this geoprocessing job was started
     */
    startTime?: number;
    /**
     * unix timestamp of when this geoprocessing job was finished
     */
    finishTime?: number;
    /**
     * id of the Wayport geoprocessing job that user submitted to create the wayback tile package
     */
    GPJobId?: string;
    /**
     * Info about the output Tile Package created by Wayport GP service job
     */
    outputTilePackageInfo?: {
        /**
         * url to download the tile package
         */
        url: string;
        /**
         * size of the output tile package
         */
        size: number;
    };
    /**
     * id of the user who created this download job.
     * We need this information to determine which download jobs to display in the UI,
     * as we only want to show the download jobs created by the current user.
     */
    userId: string;
};

export type DownloadModeState = {
    jobs: {
        byId: {
            [key: string]: DownloadJob;
        };
        ids: string[];
    };
    /**
     * ID of the download job currently being created.
     */
    idOfJobBeingCreated: string | null;
    /**
     * ID of the download job that user wants to display the extent of on the map.
     */
    idOfJobToShowExtentOnMap: string | null;
    /**
     * Timestamp of when idOfJobToShowExtentOnMap was last updated.
     * Used to trigger map extent updates when the user clicks the same job card multiple times.
     * Since clicking the same job card doesn't change the ID, this timestamp ensures the map zooms to the job's extent every time the user clicks the job card, even if it's the same job as before.
     */
    timestampOfDisplayExtentOnMapRequest: number;
    /**
     * Error message to display in the UI when creating or updating a download job fails. This can be used to inform user about what went wrong and how to fix it.
     */
    errorMessage: string;
};

export const initialDownloadModeState: DownloadModeState = {
    jobs: {
        byId: {},
        ids: [],
    },
    idOfJobBeingCreated: null,
    idOfJobToShowExtentOnMap: null,
    timestampOfDisplayExtentOnMapRequest: 0,
    errorMessage: '',
};

const slice = createSlice({
    name: 'Download',
    initialState: initialDownloadModeState,
    reducers: {
        downloadJobCreated: (state, action: PayloadAction<DownloadJob>) => {
            const { id } = action.payload;
            state.jobs.byId[id] = action.payload;
            state.jobs.ids = [id, ...state.jobs.ids];
            state.idOfJobBeingCreated = id;
        },
        downloadJobRemoved: (state, action: PayloadAction<string>) => {
            const idOfJob2BeRemoved = action.payload;
            delete state.jobs.byId[idOfJob2BeRemoved];
            state.jobs.ids = state.jobs.ids.filter(
                (id) => id !== idOfJob2BeRemoved
            );

            if (state.idOfJobBeingCreated === idOfJob2BeRemoved) {
                state.idOfJobBeingCreated = null;
            }
        },
        downloadJobsUpdated: (state, action: PayloadAction<DownloadJob[]>) => {
            for (const job of action.payload) {
                const { id } = job;
                state.jobs.byId[id] = job;
            }
        },
        errorMessageUpdated: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        idOfJobBeingCreatedUpdated: (
            state,
            action: PayloadAction<string | null>
        ) => {
            state.idOfJobBeingCreated = action.payload;
        },
        idOfJobToShowExtentOnMapUpdated: (
            state,
            action: PayloadAction<{
                idOfJobToShow: string | null;
                requestedOn: number;
            }>
        ) => {
            state.idOfJobToShowExtentOnMap = action.payload?.idOfJobToShow;
            state.timestampOfDisplayExtentOnMapRequest =
                action.payload?.requestedOn;
        },
    },
});

const { reducer } = slice;

export const {
    // isDownloadDialogOpenToggled,
    // isAddingNewDownloadJobToggled,
    downloadJobCreated,
    downloadJobRemoved,
    downloadJobsUpdated,
    errorMessageUpdated,
    idOfJobBeingCreatedUpdated,
    idOfJobToShowExtentOnMapUpdated,
} = slice.actions;

export default reducer;
