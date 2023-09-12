import { IExtent } from '@esri/arcgis-rest-request';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { batch } from 'react-redux';
import {
    DownloadJob,
    DownloadJobStatus,
    downloadJobCreated,
    downloadJobRemoved,
    downloadJobsUpdated,
    isDownloadDialogOpenToggled,
} from './reducer';
import { nanoid } from 'nanoid';
import { getTileEstimationsInOutputBundle } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import {
    checkJobStatus,
    getJobOutputInfo,
    submitJob,
} from '@services/export-wayback-bundle/wayportGPService';
import {
    selectDownloadJobs,
    selectNumOfPendingDownloadJobs,
    selectPendingDownloadJobs,
} from './selectors';

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

export const addToDownloadList =
    ({ releaseNum, zoomLevel, extent }: AddToDownloadListParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log(waybackItem, zoomLevel, extent);

        const { WaybackItems } = getState();

        const { byReleaseNumber } = WaybackItems;

        const tileEstimations = await getTileEstimationsInOutputBundle(
            extent,
            zoomLevel,
            releaseNum
        );

        // const totalTiles = tileEstimations.reduce((total, curr)=>{
        //     return total + curr.count
        // }, 0)

        const maxZoomLevel = tileEstimations[tileEstimations.length - 1].level;

        const downloadJob: DownloadJob = {
            id: nanoid(),
            waybackItem: byReleaseNumber[releaseNum],
            minZoomLevel: zoomLevel,
            maxZoomLevel,
            tileEstimations,
            // totalTiles,
            levels: [zoomLevel, maxZoomLevel],
            extent,
            status: 'not started',
            // createdTime: new Date().getTime(),
        };

        batch(() => {
            dispatch(downloadJobCreated(downloadJob));
            dispatch(isDownloadDialogOpenToggled());
        });
    };

export const updateUserSelectedZoomLevels =
    (id: string, levels: number[]) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        const { DownloadMode } = getState();

        const { jobs } = DownloadMode;

        const { byId } = jobs;

        if (!byId[id]) {
            console.error('cannot find job data with job id of %s', id);
            return;
        }

        const updatedJobData: DownloadJob = {
            ...byId[id],
            levels,
        };

        dispatch(downloadJobsUpdated([updatedJobData]));
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

            const updatedJobData: DownloadJob = {
                ...byId[id],
                GPJobId: res.jobId,
                status: 'pending',
            };

            dispatch(downloadJobsUpdated([updatedJobData]));
        } catch (err) {
            console.log(err);
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

            dispatch(downloadJobsUpdated(updatedJobsData));

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
            downloadJobsUpdated([
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

            false;
        });

        for (const job of jobsToBeRemoved) {
            dispatch(downloadJobRemoved(job.id));
        }
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

            dispatch(downloadJobsUpdated(updatedJobData));
        } catch (err) {
            console.error(err);
        }
        // console.log(tilePackageInfoResponses)
    };
