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
    idOfJobBeingCreatedUpdated,
    idOfJobToShowExtentOnMapUpdated,
    // idOfSelectedJobUpdated,
    // isAddingNewDownloadJobToggled,
    // isDownloadDialogOpenToggled,
} from './reducer';
import { nanoid } from 'nanoid';
import {
    getTileEstimationsInOutputBundle,
    TileEstimation,
} from '@services/wayport/getTileEstimationsInOutputBundle';
import {
    checkJobStatus,
    getJobOutputInfo,
    submitJob,
} from '@services/wayport/wayportGPService';
import {
    selectDownloadJobById,
    selectDownloadJobsThatHaveFinished,
    selectFinishedDownloadJobsWithoutPackageInfo,
    // selectDownloadJobs,
    selectNewDownloadJob,
    selectPendingDownloadJobs,
    selectStaleDownloadJobs,
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
    normalizeExtent,
    saveNewDownloadJobToSessionStorage,
} from './helpers';
import { parseDownloadJobProgress } from '@services/wayport/wayportHelpers';

type InitiateDownloadJobParams = {
    /**
     * user selected wayback release number
     */
    releaseNum: number;
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
export const DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB = 23;

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
        // clear the id of the job being created in the store since we are starting to create a new job,
        // and the previous job being created (if any) will be cleared later when the new job is created
        dispatch(idOfJobBeingCreatedUpdated(null));

        // clear the id of the job that is being shown extent on map, so that the extent of that job will be removed from the map before we create a new job and show the new job's extent on the map
        dispatch(updateIdOfWayportJobToShowExtentOnMap(null));

        // switch to wayport mode
        dispatch(updateMapMode('wayport'));

        // set active wayback item to the selected release number
        dispatch(setActiveWaybackItem(releaseNum));

        // close preview window as we are no longer in explore mode
        dispatch(setPreviewWaybackItem(null));
    };

/**
 * Initiates a new download job with the specified release number and extent.
 *
 * @param params - The parameters for initiating the download job
 * @param params.releaseNum - The release number of the wayback item to download
 * @param params.extent - The geographic extent for the download job
 */
export const initiateNewDownloadJob =
    ({ releaseNum, extent }: InitiateDownloadJobParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log(waybackItem, zoomLevel, extent);

        if (!extent) {
            console.error('Cannot add to download list without a valid extent');
            return;
        }

        if (!releaseNum && releaseNum !== 0) {
            console.error(
                'Cannot add to download list without a valid release number'
            );
            return;
        }

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
            extent: normalizeExtent(extent),
            status: 'not started',
            // tileEstimations and related info are set to null initially
            // as they will be updated when user adjust the export extent
            tileEstimations: null,
            minZoomLevel: DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
            maxZoomLevel: DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB,
            levels: [
                DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
                DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB,
            ],
            userId,
            createdAt: new Date().getTime(),
        };

        if (!userId) {
            // save the new download job data to session storage so that we can restore the job after user signs in
            saveNewDownloadJobToSessionStorage(newDownloadJobToAdd);

            signIn();

            return;
        }

        dispatch(createDownloadJob(newDownloadJobToAdd));
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
            console.error('No new download job found to update');
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

/**
 * Restores a new download job from session storage and dispatches it to the store.
 *
 * This thunk checks if a user is signed in and if a download job exists in session storage.
 * If both conditions are met, it dispatches the stored download job to create a new download job in the store.
 *
 * @returns A thunk function that takes a dispatch parameter and returns void
 *
 * @remarks
 * - If no user is signed in, the operation is skipped silently
 * - If no download job is found in session storage, the operation is skipped silently
 */
export const restoreNewDownloadJobFromSessionStorage =
    () => (dispatch: StoreDispatch) => {
        const signedInUser = getSignedInUser();

        if (!signedInUser) {
            // console.log('No signed in user, skipping restoring new wayport job from session storage');
            return;
        }

        const newWayportJobFromStorage = getNewDownloadJobFromSessionStorage();

        if (!newWayportJobFromStorage) {
            // console.log('No new wayport job found in session storage to restore');
            return;
        }

        // Update the userId for the job retrieved from session storage.
        // The job was created before sign-in, so we assign the signed-in user's ID
        // to ensure proper association with the user when creating the job in the backend.
        const downloadJobToBeCreated: DownloadJob = {
            ...newWayportJobFromStorage,
            userId: signedInUser.username,
        };

        dispatch(createDownloadJob(downloadJobToBeCreated));
    };

export const startDownloadJob =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // const { DownloadMode } = getState();

        // const { jobs } = DownloadMode;

        // const { byId } = jobs;

        // if (!byId[id]) {
        //     console.error('cannot find job data with job id of %s', id);
        //     return;
        // }

        const newDownloadJob = selectNewDownloadJob(getState());

        if (!newDownloadJob) {
            console.error('No new download job found to start');
            return;
        }

        const { extent, levels, waybackItem, id, userId } = newDownloadJob;

        // set the job status to "waiting to start" immediately to provide feedback in the UI that the job is being processed,
        dispatch(updateJobStatus(id, 'waiting to start'));

        // set the id of the job to show extent on map to the new job's id so that the extent of the new job will be shown on the map while the job is being started
        dispatch(updateIdOfWayportJobToShowExtentOnMap(id));

        try {
            if (!userId) {
                throw new Error(
                    'Missing user ID for the download job. Please make sure you are signed in before starting the download job.'
                );
            }

            const res = await submitJob({
                extent,
                levels,
                layerIdentifier: waybackItem.layerIdentifier,
            });

            const submittedJob: DownloadJob = {
                ...newDownloadJob,
                GPJobId: res.jobId,
                status: 'pending',
            };

            dispatch(updateDownloadJobs([submittedJob]));
        } catch (err) {
            // console.log(err);

            const failedJob: DownloadJob = {
                ...newDownloadJob,
                status: 'failed',
                errorMessage: err.message || 'Unknown error',
            };

            dispatch(updateDownloadJobs([failedJob]));
        }
    };

export const updateJobStatus =
    (id: string, status: DownloadJobStatus) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // const jobs = selectDownloadJobs(getState());

        // const jobToBeUpdated = jobs.find((job) => job.id === id);

        const jobToBeUpdated = selectDownloadJobById(getState(), id);

        if (!jobToBeUpdated) {
            console.error('cannot find job data with job id of %s', id);
            return;
        }

        const updatedJobData = {
            ...jobToBeUpdated,
            status,
        };

        await dispatch(updateDownloadJobs([updatedJobData]));
    };

/**
 * This thunk function is used to check the status of pending download jobs, and update the job status in the store based on the response from Wayport GP service.
 * @returns
 */
export const checkPendingDownloadJobStatus =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // clearTimeout(checkDownloadJobStatusTimeout);

        const pendingJobs = selectPendingDownloadJobs(getState());

        if (!pendingJobs.length) {
            return;
        }

        const checkJobStatusRequests = pendingJobs.map((downloadJob) => {
            return checkJobStatus(downloadJob.GPJobId);
        });

        // wait for all check job status requests to be settled,
        const checkJobStatusResponses = await Promise.all(
            checkJobStatusRequests
        );

        const finishedJobs: DownloadJob[] = [];

        const ongoingJobsWithProgressInfo: DownloadJob[] = [];

        for (let i = 0; i < checkJobStatusResponses.length; i++) {
            // const fulfilledResponse = fulfilledResponses[i];

            const res = checkJobStatusResponses[i];

            // if the response is invalid or doesn't contain jobStatus, skip updating the job status for that job
            if (!res || !res?.jobStatus) {
                continue;
            }

            if (
                res.jobStatus === 'esriJobSucceeded' ||
                res.jobStatus === 'esriJobFailed'
            ) {
                const existingJobData = pendingJobs[i];

                const status: DownloadJobStatus =
                    res.jobStatus === 'esriJobSucceeded'
                        ? 'finished'
                        : 'failed';

                const finishTime: number = new Date().getTime();

                finishedJobs.push({
                    ...existingJobData,
                    status,
                    finishTime,
                });
            }

            if (res.jobStatus === 'esriJobExecuting') {
                const progressInfo = parseDownloadJobProgress(res);

                if (progressInfo && progressInfo?.totalBundles > 0) {
                    const existingJobData = pendingJobs[i];

                    ongoingJobsWithProgressInfo.push({
                        ...existingJobData,
                        progressInfo,
                    });
                }
            }
        }

        if (finishedJobs.length) {
            dispatch(updateDownloadJobs(finishedJobs));
        }

        if (ongoingJobsWithProgressInfo.length) {
            dispatch(updateDownloadJobs(ongoingJobsWithProgressInfo));
        }

        // const updatedJobsData: DownloadJob[] = checkJobStatusResponses.map(
        //     (res, index) => {
        //         const existingJobData = pendingJobs[index];

        //         let status: DownloadJobStatus = 'pending';
        //         let finishTime: number = null;

        //         if (
        //             res.jobStatus === 'esriJobSucceeded' ||
        //             res.jobStatus === 'esriJobFailed'
        //         ) {
        //             status =
        //                 res.jobStatus === 'esriJobSucceeded'
        //                     ? 'finished'
        //                     : 'failed';

        //             finishTime = new Date().getTime();
        //         }

        //         return {
        //             ...existingJobData,
        //             status,
        //             finishTime,
        //         };
        //     }
        // );

        // dispatch(updateDownloadJobs(updatedJobsData));

        // dispatch(getOutputTilePackageInfo());
    };

export const downloadOutputTilePackage =
    (jobId: string) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobToBeDownloaded = selectDownloadJobById(getState(), jobId);

        if (!jobToBeDownloaded) {
            console.error('cannot find job data with job id of %s', jobId);
            return;
        }

        const { outputTilePackageInfo } = jobToBeDownloaded || {};

        if (!outputTilePackageInfo) {
            console.error(
                'No output tile package info found for job with id of %s',
                jobId
            );
            return;
        }

        window.open(outputTilePackageInfo.url, '_blank');

        // set the job status to "downloaded" immediately to provide feedback in the UI that the job is being downloaded,
        dispatch(
            updateDownloadJobs([
                {
                    ...jobToBeDownloaded,
                    status: 'downloaded',
                },
            ])
        );
    };

/**
 * remove download jobs that has been downloaded or failed, or has been finished for more than 1 hour, to keep the download list clean and avoid confusion for users.
 * @returns
 */
export const clearDownloadJobs =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobs = selectDownloadJobsThatHaveFinished(getState());

        if (!jobs.length) {
            console.log(
                'No finished download job found, skipping cleaning up download jobs'
            );
            return;
        }

        // unix timestamp of curren time
        const now = new Date().getTime();

        // find jobs that were finished more than 1 hour ago
        const jobsToBeRemoved = jobs.filter((job) => {
            // donwloaded jobs and failed jobs will be removed immediately without waiting for 1 hour, as they are no longer useful for users after they are downloaded or failed
            if (job.status === 'downloaded' || job.status === 'failed') {
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
    };

/**
 * get output tile package info for finished jobs
 * @returns
 */
export const assignTilePackageInfoToDownloadJobs =
    (finishedDownloadJobsWithoutPackageInfo: DownloadJob[]) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // const finishedDownloadJobsWithoutPackageInfo = selectFinishedDownloadJobsWithoutPackageInfo(getState());

        if (!finishedDownloadJobsWithoutPackageInfo.length) {
            return;
        }

        const tilePackageInfoRequests =
            finishedDownloadJobsWithoutPackageInfo.map((job) => {
                return getJobOutputInfo(job.GPJobId);
            });

        const tilePackageInfoResponses = await Promise.all(
            tilePackageInfoRequests
        );
        // console.log(tilePackageInfoResponses);

        const jobsWithOutputTilePackageInfo: DownloadJob[] = [];

        for (let i = 0; i < tilePackageInfoResponses.length; i++) {
            const tilePackageInfo = tilePackageInfoResponses[i];

            // if tile package info is not available for the job, skip updating the job with tile package info
            if (!tilePackageInfo) {
                continue;
            }

            const existingJobData = finishedDownloadJobsWithoutPackageInfo[i];

            jobsWithOutputTilePackageInfo.push({
                ...existingJobData,
                outputTilePackageInfo: tilePackageInfo,
            });
        }

        if (jobsWithOutputTilePackageInfo.length) {
            dispatch(updateDownloadJobs(jobsWithOutputTilePackageInfo));
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
const createDownloadJob =
    (jobToBeCreated: DownloadJob) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const staleDownloadJobs = selectStaleDownloadJobs(getState());

        try {
            // Clear up stale download jobs before adding the new download job to
            // avoid potential conflict between the new download job and the stale download jobs
            if (staleDownloadJobs && staleDownloadJobs.length > 0) {
                await dispatch(deleteDownloadJobs(staleDownloadJobs));
            }

            await wayportJobsStore.addJob(jobToBeCreated);
            dispatch(downloadJobCreated(jobToBeCreated));
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

export const updateIdOfWayportJobToShowExtentOnMap =
    (idOfJobToShow: string | null) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        const requestedOn = idOfJobToShow ? new Date().getTime() : 0;

        dispatch(
            idOfJobToShowExtentOnMapUpdated({
                idOfJobToShow,
                requestedOn,
            })
        );
    };

export const toggleWayportMode =
    () => (dispatch: StoreDispatch, getState: StoreGetState) => {
        const mode = selectMapMode(getState());

        const targetMode: MapMode = mode === 'wayport' ? 'explore' : 'wayport';

        dispatch(updateMapMode(targetMode));
    };
