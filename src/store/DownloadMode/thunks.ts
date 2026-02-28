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

import { IExtent } from '@typings/index';
import { StoreDispatch, StoreGetState } from '../configureStore';
// import { batch } from 'react-redux';
import {
    DownloadJob,
    DownloadJobStatus,
    downloadJobCreated,
    downloadJobRemoved,
    downloadJobsUpdated,
    errorMessageUpdated,
    // idOfSelectedJobUpdated,
    // isAddingNewDownloadJobToggled,
    // isDownloadDialogOpenToggled,
} from './reducer';
import { nanoid } from 'nanoid';
import {
    getTileEstimationsInOutputBundle,
    TileEstimation,
} from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import {
    checkJobStatus,
    getJobOutputInfo,
    submitJob,
} from '@services/export-wayback-bundle/wayportGPService';
import {
    selectDownloadJobs,
    selectNewDownloadJob,
    selectNumOfPendingDownloadJobs,
    selectPendingDownloadJobs,
} from './selectors';
// import { isDownloadDialogOpenToggled } from '@store/UI/reducer';
import { MapMode, selectMapMode } from '@store/Map/reducer';
import { updateMapMode } from '@store/Map/thunks';
import {
    setActiveWaybackItem,
    setPreviewWaybackItem,
} from '@store/Wayback/reducer';
import { getSignedInUser, signIn } from '@utils/Esri-OAuth';
import { wayportJobsStore } from '@utils/wayportJobsStore';
import {
    getNewDownloadJobFromSessionStorage,
    saveNewDownloadJobToSessionStorage,
} from './helpers';

type AddToDownloadListParams = {
    /**
     * user selected wayback release number
     */
    releaseNum: number;
    /**
     * current map zoom level
     */
    zoomLevel: number;
    /**
     * current map extent
     */
    extent: IExtent;
};

let checkDownloadJobStatusTimeout: NodeJS.Timeout;

const CHECK_JOB_STATUS_DELAY_IN_SECONDS = 15;

const DOWNLOAD_JOB_TIME_TO_LIVE_IN_SECONDS = 3600;

/**
 * Min tile package level should always be 1 by default.
 *
 * @see https://github.com/vannizhang/wayback/issues/90
 */
export const DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB = 1;

/**
 * Max tile package level is set to 23.
 */
export const DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB = 18;

/**
 * Prepares the application state for a new download job.
 *
 * @param releaseNum - The release number to set as the active wayback item
 * @returns A thunk function that dispatches actions to update the store
 *
 * @remarks
 * This thunk performs the following operations:
 * - Switches the map mode to 'wayport'
 * - Sets the active wayback item to the specified release number
 * - Closes the preview window by clearing the active preview item
 * - Toggles the "adding new download job" flag to indicate a new job is being created
 */
const prepareForNewDownloadJob =
    (releaseNum: number) => (dispatch: StoreDispatch) => {
        // switch to wayport mode
        dispatch(updateMapMode('wayport'));

        // set active wayback item to the selected release number
        dispatch(setActiveWaybackItem(releaseNum));

        // close preview window as we are no longer in explore mode
        dispatch(setPreviewWaybackItem(null));
    };

export const addToDownloadList =
    ({ releaseNum, extent }: AddToDownloadListParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log(waybackItem, zoomLevel, extent);

        // prepare application state for new download job
        dispatch(prepareForNewDownloadJob(releaseNum));

        const { WaybackItems } = getState();

        const { byReleaseNumber } = WaybackItems;

        // get the signed in user id to associate with this download job
        const signedInUserId = getSignedInUser();

        const userId = signedInUserId?.username || '';

        const newDownloadJobToAdd: DownloadJob = {
            id: nanoid(),
            waybackItem: {
                ...byReleaseNumber[releaseNum],
            },
            extent,
            status: 'not started',
            // tileEstimations and related info are set to null initially
            // as they will be updated when user adjust the export extent
            tileEstimations: null,
            minZoomLevel: null,
            maxZoomLevel: null,
            levels: [
                DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
                DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB,
            ],
            userId,
            // createdTime: new Date().getTime(),
        };

        if (!userId) {
            // save the new download job data to session storage so that we can restore the job after user signs in
            saveNewDownloadJobToSessionStorage(newDownloadJobToAdd);

            signIn();

            return;
        }

        // dispatch(downloadJobCreated(downloadJob));
        // dispatch(isAddingNewDownloadJobToggled());

        dispatch(createDonwloadJob(newDownloadJobToAdd));

        // // set the newly created download job as the selected job so that its extent can be displayed on the map
        // dispatch(idOfSelectedJobUpdated(newDownloadJobToAdd.id));
    };

/**
 * This thunk function is used to update the new download job data when user adjust the export extent or zoom levels.
 * @param updatedJobData
 * @returns
 */
export const updateNewDownloadJob =
    ({
        extent,
        levels,
        tileEstimations,
    }: {
        extent?: IExtent;
        levels?: number[];
        tileEstimations?: TileEstimation[];
    }) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        const newJob = selectNewDownloadJob(getState());

        if (!newJob) {
            // console.error('cannot find existing job data for the new download job');
            return;
        }

        if (newJob.status !== 'not started') {
            // console.error('the status of the new download job is not "not started", cannot update the new download job data');
            return;
        }

        const updatedJobData = {
            ...newJob,
        };

        if (tileEstimations !== undefined) {
            updatedJobData.tileEstimations = tileEstimations;
        }

        if (levels !== undefined) {
            updatedJobData.levels = levels;
        }

        if (extent !== undefined) {
            updatedJobData.extent = extent;
        }

        dispatch(updateDownloadJobs([updatedJobData]));
    };

export const startDownloadJob =
    (id: string) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const { DownloadMode } = getState();

        const { jobs } = DownloadMode;

        const { byId } = jobs;

        if (!byId[id]) {
            console.error('cannot find job data with job id of %s', id);
            return;
        }

        const { extent, levels, waybackItem } = byId[id];

        try {
            const res = await submitJob({
                extent,
                levels,
                layerIdentifier: waybackItem.layerIdentifier,
            });

            const submittedJob: DownloadJob = {
                ...byId[id],
                GPJobId: res.jobId,
                status: 'pending',
            };

            dispatch(updateDownloadJobs([submittedJob]));
        } catch (err) {
            console.log(err);

            const failedJob: DownloadJob = {
                ...byId[id],
                status: 'failed',
            };

            dispatch(updateDownloadJobs([failedJob]));
        }
    };

export const checkPendingDownloadJobStatus =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
        clearTimeout(checkDownloadJobStatusTimeout);

        const pendingJobs = selectPendingDownloadJobs(getState());

        if (!pendingJobs.length) {
            return;
        }

        checkDownloadJobStatusTimeout = setTimeout(async () => {
            const checkJobStatusRequests = pendingJobs.map((downloadJob) => {
                return checkJobStatus(downloadJob.GPJobId);
            });

            const checkJobStatusResponses = await Promise.all(
                checkJobStatusRequests
            );

            const updatedJobsData: DownloadJob[] = checkJobStatusResponses.map(
                (res, index) => {
                    const existingJobData = pendingJobs[index];

                    let status: DownloadJobStatus = 'pending';
                    let finishTime: number = null;

                    if (
                        res.jobStatus === 'esriJobSucceeded' ||
                        res.jobStatus === 'esriJobFailed'
                    ) {
                        status =
                            res.jobStatus === 'esriJobSucceeded'
                                ? 'finished'
                                : 'failed';

                        finishTime = new Date().getTime();
                    }

                    return {
                        ...existingJobData,
                        status,
                        finishTime,
                    };
                }
            );

            dispatch(updateDownloadJobs(updatedJobsData));

            dispatch(getOutputTilePackageInfo());

            // call this thunk function again in case there are still pending jobs left
            dispatch(checkPendingDownloadJobStatus());
        }, CHECK_JOB_STATUS_DELAY_IN_SECONDS * 1000);
    };

export const downloadOutputTilePackage =
    (id: string) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const { DownloadMode } = getState();

        const { jobs } = DownloadMode;

        const { byId } = jobs;

        if (!byId[id]) {
            console.error('cannot find job data with job id of %s', id);
            return;
        }

        const { outputTilePackageInfo } = byId[id];

        if (!outputTilePackageInfo) {
            return;
        }

        window.open(outputTilePackageInfo.url, '_blank');

        dispatch(
            updateDownloadJobs([
                {
                    ...byId[id],
                    status: 'downloaded',
                },
            ])
        );
    };

/**
 * remove download jobs that has been downloaded or are expired
 * @returns
 */
export const cleanUpDownloadJobs =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobs = selectDownloadJobs(getState());

        // unix timestamp of curren time
        const now = new Date().getTime();

        // find jobs that were finished more than 1 hour ago
        const jobsToBeRemoved = jobs.filter((job) => {
            // downloaded job should be removed
            if (job.status === 'downloaded') {
                return true;
            }

            // any finished job that is 1 hour old should be removed
            if (job.finishTime) {
                const secondsSinceJobWasFinished =
                    (now - job.finishTime) / 1000;
                return (
                    secondsSinceJobWasFinished >
                    DOWNLOAD_JOB_TIME_TO_LIVE_IN_SECONDS
                );
            }

            return false;
        });

        if (!jobsToBeRemoved.length) {
            return;
        }

        dispatch(deleteDownloadJobs(jobsToBeRemoved));

        // for (const job of jobsToBeRemoved) {
        //     dispatch(downloadJobRemoved(job.id));
        // }
    };

/**
 * get output tile package info for finished jobs
 * @returns
 */
export const getOutputTilePackageInfo =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobs = selectDownloadJobs(getState());

        const finishedJobs = jobs.filter((job) => {
            return (
                job.status === 'finished' &&
                job.outputTilePackageInfo === undefined
            );
        });

        if (!finishedJobs.length) {
            return;
        }

        const tilePackageInfoRequests = finishedJobs.map((job) => {
            return getJobOutputInfo(job.GPJobId);
        });

        try {
            const tilePackageInfoResponses = await Promise.all(
                tilePackageInfoRequests
            );
            console.log(tilePackageInfoResponses);

            const updatedJobData = finishedJobs.map((jobData, index) => {
                return {
                    ...jobData,
                    outputTilePackageInfo: tilePackageInfoResponses[index],
                };
            });

            dispatch(updateDownloadJobs(updatedJobData));
        } catch (err) {
            console.error(err);
        }
        // console.log(tilePackageInfoResponses)
    };

/**
 * This thunk function is used to create a new download job and persist it to IndexedDB when user add a wayback item to the download list.
 * It dispatches the action to update the store with the new download job data only after the new download job is successfully persisted to IndexedDB,
 * so that we can ensure the store is always in sync with IndexedDB.
 *
 * @param jobData data of the new download job to be created and added to the store and persisted to IndexedDB
 * @returns void
 */
const createDonwloadJob =
    (jobData: DownloadJob) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        try {
            const existingNewDownloadJob = selectNewDownloadJob(getState());

            // If there is already an existing new download job in the store, we need to remove it before creating a new one, because the application only supports one new download job that is being created at a time.
            if (existingNewDownloadJob) {
                await dispatch(deleteDownloadJobs([existingNewDownloadJob]));
            }

            await wayportJobsStore.addJob(jobData);
            dispatch(downloadJobCreated(jobData));
        } catch (err) {
            console.error('Failed to add download job to IndexedDB:', err);
            // return;

            dispatch(
                errorMessageUpdated(
                    `Failed to create download job. Error: ${err.message || 'Unknown error'}`
                )
            );
        }
    };

/**
 * This thunk function is used to update the download job data when there is any change for the existing download jobs,
 * such as when user adjust the export extent/zoom levels for a pending job,
 * or when the status/tile package info of a pending job is updated after checking with Wayport GP service.
 *
 * It also persists the updated download job data to IndexedDB so that the download job data can be retained even after page refresh.
 * @param updatedJobsData an array of updated download job data to be updated in the store and persisted to IndexedDB
 * @returns
 */
const updateDownloadJobs =
    (updatedJobsData: DownloadJob[]) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        if (!updatedJobsData || !updatedJobsData.length) {
            return;
        }

        try {
            for (const job of updatedJobsData) {
                if (!job.id) {
                    console.error('job id is missing for job data:', job);
                    continue;
                }

                // Persist update to IndexedDB

                await wayportJobsStore.updateJob(job);
            }

            dispatch(downloadJobsUpdated(updatedJobsData));
        } catch (err) {
            console.error('Failed to update download jobs in IndexedDB:', err);

            dispatch(
                errorMessageUpdated(
                    `Failed to update download job. Error: ${err.message || 'Unknown error'}`
                )
            );
        }
    };

/**
 * This thunk function is used to delete download jobs from the store and IndexedDB when user delete download jobs from the download list in the UI.
 * @param jobsToBeDeleted an array of download jobs to be deleted from the store and IndexedDB
 * @returns void
 */
export const deleteDownloadJobs =
    (jobsToBeDeleted: DownloadJob[]) => async (dispatch: StoreDispatch) => {
        try {
            for (const job of jobsToBeDeleted) {
                if (!job.id) {
                    console.error('job id is missing for job data:', job);
                    continue;
                }

                await wayportJobsStore.deleteJob(job.id);
                dispatch(downloadJobRemoved(job.id));
            }
        } catch (err) {
            console.error('Failed to delete download job from IndexedDB:', err);

            dispatch(
                errorMessageUpdated(
                    `Failed to delete download job. Error: ${err.message || 'Unknown error'}`
                )
            );
        }
    };

export const toggleWayportMode =
    () => (dispatch: StoreDispatch, getState: StoreGetState) => {
        const mode = selectMapMode(getState());

        const targetMode: MapMode = mode === 'wayport' ? 'explore' : 'wayport';

        dispatch(updateMapMode(targetMode));
    };
