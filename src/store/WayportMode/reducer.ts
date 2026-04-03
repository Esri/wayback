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
 * Status of the wayport wayport job, which is created when user submits a geoprocessing job to Wayport GP service to generate a wayback tile package.
 * The status is used to track the progress of the wayport job and show the appropriate information in the UI.
 */
export type WayportJobStatus =
    | 'wayport job not started' // initial status before submission to Wayport GP service
    | 'wayport job waiting to start' // submitted to Wayport GP service, waiting for the GP job to begin
    | 'wayport job pending' // GP job is running
    | 'wayport job finished' // GP job completed successfully; tile package is ready for download
    | 'wayport job failed' // GP job failed; error message is saved and displayed in the UI
    | 'wayport job downloaded' // user has successfully downloaded the tile package
    | 'wayport job expired' // the output tile package has expired and is no longer available for download; this can happen when the tile package has been generated for a while but user hasn't downloaded it yet, or when user tries to download the tile package after a certain period of time since the tile package is generated (e.g., 7 days), depending on how long the Wayport GP service keeps the generated tile packages available for download
    | 'publishing job waiting to start' // publishing job is waiting to start, this happens right after user clicks the button to publish the tile layer, and before we the tile package item is created in ArcGIS Online, which is the first step of the publishing process
    | 'publishing job adding tile package' // adding the output tile package as an item in ArcGIS Online
    | 'publishing job added tile package' // the output tile package has been added as an item in ArcGIS Online
    // | 'publishing job adding tile layer' // publishing a hosted tile layer from the tile package item
    | 'publishing job added tile layer' // hosted tile layer has been published from the tile package item
    | 'publishing job updating tiles' // sending an update tiles request to the hosted tile service
    | 'publishing job updated tiles' // update tiles request has completed and the hosted tile layer has been updated with the new tiles
    | 'publishing job finished' // tiled layer published and update tiles request sent; new tiles may still be generating
    | 'publishing job failed'; // failed at some step of adding item, publishing, or updating tiles; error message is saved and displayed in the UI

// /**
//  * Status of the process of publishing a hosted tile layer from the wayback tile package and updating tiles, which happens after the wayport GP job is finished and the tile package is ready.
//  */
// export type PublishWayportTileLayerStatus =
//     | 'publishing job not started' // initial status before starting to publish tile layer and update tiles
//     | 'publishing job adding tile package' // adding the output tile package as an item in ArcGIS Online
//     | 'publishing job adding tile layer' // publishing a hosted tile layer from the tile package item
//     | 'publishing job updating tiles' // sending an update tiles request to the hosted tile service
//     | 'publishing job finished' // tiled layer published and update tiles request sent; new tiles may still be generating
//     | 'publishing job failed'; // failed at some step of adding item, publishing, or updating tiles; error message is saved and displayed in the UI

/**
 * Progress info of a wayport job, including total number of bundles, number of completed bundles, and percentage of progress.
 */
export type WayportJobProgressInfo = {
    /**
     * The total number of bundles that need to be generated for the wayport job.
     */
    totalBundles: number;
    /**
     * The number of bundles that have been completed so far for the wayport job. This is used to calculate the progress percentage of the wayport job.
     */
    completedBundles: number;
    /**
     * The percentage of progress for the wayport job, calculated as (completedBundles / totalBundles) * 100. This gives a clear indication of how much of the wayport job has been completed.
     */
    progressPercentage: number;
};

/**
 * A wayport job stands for Wayback Export job, which represents a user's request to export a wayback item as a tile package through the Wayport GP service.
 */
export type WayportJob = {
    /**
     * unique identifier of this wayport job
     */
    id: string;
    // /**
    //  * wayback release number for this wayport job
    //  */
    // releaseNum: number;
    /**
     * wayback item associated with this wayport job
     */
    waybackItem: IWaybackItem;
    /**
     * map extent of this wayport job
     */
    extent: IExtent;
    /**
     * This wayport job has a minimum zoom level. We use the zoom level of the map when user creates this job as the minimum zoom level .
     * Users are not allowed to select a zoom level lower than the minZoomLevel.
     * For example, if the user's current zoom level is 12, they can only choose zoom levels 12 and above (12-16), but not 10-16.
     */
    minZoomLevel: number;
    /**
     * This wayport job has a predefined maximum zoom level. The maximum zoom level will be determined based on the `minZoomLevel`.
     * There is an upper limit on the total number of tiles (e.g., 150,000) that can be included in each wayport job.
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
     * status of this wayport job
     */
    status: WayportJobStatus;
    /**
     * id of the user who created this wayport job.
     * We need this information to determine which wayport jobs to display in the UI,
     * as we only want to show the wayport jobs created by the current user.
     */
    userId: string;
    /**
     * timestamp of when this wayport job is created.
     */
    createdAt: number;
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
         * alternative url to download the tile package with an alternative file name (instead of the default "wayport.tpkx") extracted from GP job messages,
         * used to avoid naming conflicts when adding the tile package item and sending update tiles requests.
         */
        alternativeUrl: string;
        /**
         * size of the output tile package
         */
        size: number;
    };
    /**
     * error message to display in the UI when this wayport job fails. This can be used to inform user about what went wrong.
     */
    errorMessage?: string;
    /**
     * progress info of this wayport job, including total number of bundles, number of completed bundles, and percentage of progress.
     * This is used to show the progress of the wayport job in the UI while the job is still running and has not finished yet.
     */
    progressInfo?: WayportJobProgressInfo;
    /**
     * Item ID of the tile package created for this job's output tile package. This is used to track the item in ArcGIS Portal and update the UI accordingly.
     */
    wayportTilePackageItemId?: string;
    /**
     * URL of the tile layer published from this job's tile package.
     */
    wayportTileLayerServiceUrl?: string;
    /**
     * Item ID of the hosted tile layer published from this job's tile package. This is used to track the item in ArcGIS Portal and update the UI accordingly.
     */
    wayportTileLayerServiceItemId?: string;
    /**
     * Error caught while publishing tile layer from this job's tile package. This is used to display error message in the UI if publishing failed.
     */
    errorCaughtWhilePublishWayportTileLayer?: string;
};

export type WayportModeState = {
    jobs: {
        byId: {
            [key: string]: WayportJob;
        };
        ids: string[];
    };
    /**
     * ID of the wayport job currently being created.
     */
    idOfJobBeingCreated: string | null;
    /**
     * ID of the wayport job that user wants to display the extent of on the map.
     */
    idOfJobToShowExtentOnMap: string | null;
    /**
     * Timestamp of when the zoom to wayport job extent on map request is made.
     * Used to trigger map extent updates when the user clicks the same job card multiple times.
     * Since clicking the same job card doesn't change the ID, this timestamp ensures the map zooms to the job's extent every time the user clicks the job card, even if it's the same job as before.
     */
    timestampOfZoomToDownloadJobExtentRequest: number;
    /**
     * Error message to display in the UI when creating or updating a wayport job fails. This can be used to inform user about what went wrong and how to fix it.
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
        wayportJobCreated: (state, action: PayloadAction<WayportJob>) => {
            const { id } = action.payload;
            state.jobs.byId[id] = action.payload;
            state.jobs.ids = [id, ...state.jobs.ids];
            state.idOfJobBeingCreated = id;
        },
        wayportJobRemoved: (state, action: PayloadAction<string>) => {
            const idOfJob2BeRemoved = action.payload;
            delete state.jobs.byId[idOfJob2BeRemoved];
            state.jobs.ids = state.jobs.ids.filter(
                (id) => id !== idOfJob2BeRemoved
            );

            if (state.idOfJobBeingCreated === idOfJob2BeRemoved) {
                state.idOfJobBeingCreated = null;
            }
        },
        wayportJobsUpdated: (state, action: PayloadAction<WayportJob[]>) => {
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
        // timestampOfZoomToDownloadJobExtentRequestUpdated: (
        //     state,
        //     action: PayloadAction<number>
        // ) => {
        //     state.timestampOfZoomToDownloadJobExtentRequest = action.payload;
        // },
    },
});

const { reducer } = slice;

export const {
    // isDownloadDialogOpenToggled,
    // isAddingNewDownloadJobToggled,
    wayportJobCreated,
    wayportJobRemoved,
    wayportJobsUpdated,
    errorMessageUpdated,
    idOfJobBeingCreatedUpdated,
    idOfJobToShowExtentOnMapUpdated,
    // timestampOfZoomToDownloadJobExtentRequestUpdated,
} = slice.actions;

export default reducer;
