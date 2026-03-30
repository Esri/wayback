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
import { TileEstimation } from '@services/wayport/getTileEstimationsInOutputBundle';

/**
 * Status of the wayport download job, which is created when user submits a geoprocessing job to Wayport GP service to generate a wayback tile package.
 * The status is used to track the progress of the wayport job and show the appropriate information in the UI.
 */
export type WayportJobStatus =
    | 'not started' // initial status before submission to Wayport GP service
    | 'waiting to start' // submitted to Wayport GP service, waiting for the GP job to begin
    | 'pending' // GP job is running
    | 'finished' // GP job completed successfully; tile package is ready for download
    | 'failed' // GP job failed; error message is saved and displayed in the UI
    | 'downloaded'; // user has successfully downloaded the tile package

/**
 * Status of the process of publishing a hosted tile layer from the wayback tile package and updating tiles, which happens after the wayport GP job is finished and the tile package is ready.
 */
export type PublishWayportTileLayerStatus =
    | 'not started' // initial status before starting to publish tile layer and update tiles
    | 'adding tile package item' // adding the output tile package as an item in ArcGIS Online
    | 'publishing tile layer' // publishing a hosted tile layer from the tile package item
    | 'updating tiles' // sending an update tiles request to the hosted tile service
    | 'finished' // tiled layer published and update tiles request sent; new tiles may still be generating
    | 'failed'; // failed at some step of adding item, publishing, or updating tiles; error message is saved and displayed in the UI

/**
 * Progress info of a download job, including total number of bundles, number of completed bundles, and percentage of progress.
 */
export type WayportJobProgressInfo = {
    /**
     * The total number of bundles that need to be generated for the download job.
     */
    totalBundles: number;
    /**
     * The number of bundles that have been completed so far for the download job. This is used to calculate the progress percentage of the download job.
     */
    completedBundles: number;
    /**
     * The percentage of progress for the download job, calculated as (completedBundles / totalBundles) * 100. This gives a clear indication of how much of the download job has been completed.
     */
    progressPercentage: number;
};

export type WayportJob = {
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
    status: WayportJobStatus;
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
     * Alternative output file name extracted from GP job messages, used in place of the default "wayport.tpkx"
     * to avoid naming conflicts when adding the tile package item and sending update tiles requests.
     */
    alternativeOutputName?: string;
    /**
     * id of the user who created this download job.
     * We need this information to determine which download jobs to display in the UI,
     * as we only want to show the download jobs created by the current user.
     */
    userId: string;
    /**
     * error message to display in the UI when this download job fails. This can be used to inform user about what went wrong.
     */
    errorMessage?: string;
    /**
     * progress info of this download job, including total number of bundles, number of completed bundles, and percentage of progress.
     * This is used to show the progress of the download job in the UI while the job is still running and has not finished yet.
     */
    progressInfo?: WayportJobProgressInfo;
    /**
     * timestamp of when this download job is created.
     */
    createdAt: number;
    /**
     * Info about the hosted tile layer published from this job's tile package.
     */
    wayportTileLayerInfo?: {
        /**
         * Item ID of the tile package added to ArcGIS Portal for this job's output tile package.
         */
        tilePackageItemId: string;
        /**
         * Item ID of the hosted tile layer in ArcGIS Portal.
         */
        serviceItemId: string;
        /**
         * URL of the hosted tile service endpoint.
         */
        serviceUrl: string;
        /**
         * Error message if publishing failed.
         */
        error?: string;
    };
    /**
     * Status of the process of publishing a hosted tile layer from the wayback tile package and updating tiles,
     * which happens after the wayport GP job is finished and the tile package is ready.
     */
    publishWayportTileLayerStatus?: PublishWayportTileLayerStatus;
};

export type WayportModeState = {
    jobs: {
        byId: {
            [key: string]: WayportJob;
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
     * Timestamp of when the zoom to download job extent on map request is made.
     * Used to trigger map extent updates when the user clicks the same job card multiple times.
     * Since clicking the same job card doesn't change the ID, this timestamp ensures the map zooms to the job's extent every time the user clicks the job card, even if it's the same job as before.
     */
    timestampOfZoomToDownloadJobExtentRequest: number;
    /**
     * Error message to display in the UI when creating or updating a download job fails. This can be used to inform user about what went wrong and how to fix it.
     */
    errorMessage: string;
};

export const initialWayportModeState: WayportModeState = {
    jobs: {
        byId: {},
        ids: [],
    },
    idOfJobBeingCreated: null,
    idOfJobToShowExtentOnMap: null,
    timestampOfZoomToDownloadJobExtentRequest: 0,
    errorMessage: '',
};

const slice = createSlice({
    name: 'WayportMode',
    initialState: initialWayportModeState,
    reducers: {
        downloadJobCreated: (state, action: PayloadAction<WayportJob>) => {
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
        downloadJobsUpdated: (state, action: PayloadAction<WayportJob[]>) => {
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
            state.timestampOfZoomToDownloadJobExtentRequest =
                action.payload?.requestedOn;
        },
        timestampOfZoomToDownloadJobExtentRequestUpdated: (
            state,
            action: PayloadAction<number>
        ) => {
            state.timestampOfZoomToDownloadJobExtentRequest = action.payload;
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
    timestampOfZoomToDownloadJobExtentRequestUpdated,
} = slice.actions;

export default reducer;
