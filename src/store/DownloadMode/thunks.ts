import { IExtent } from '@esri/arcgis-rest-request';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { batch } from 'react-redux';
import {
    DownloadJob,
    DownloadJobStatus,
    downloadJobCreated,
    downloadJobsUpdated,
    isDownloadDialogOpenToggled,
} from './reducer';
import { generate } from 'shortid';
import { getTileEstimationsInOutputBundle } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import {
    checkJobStatus,
    submitJob,
} from '@services/export-wayback-bundle/wayportGPService';
import {
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

export const addToDownloadList =
    ({ releaseNum, zoomLevel, extent }: AddToDownloadListParams) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log(waybackItem, zoomLevel, extent);

        const { WaybackItems } = getState();

        const { byReleaseNumber } = WaybackItems;

        const tileEstimations = getTileEstimationsInOutputBundle(
            extent,
            zoomLevel
        );

        // const totalTiles = tileEstimations.reduce((total, curr)=>{
        //     return total + curr.count
        // }, 0)

        const maxZoomLevel = tileEstimations[tileEstimations.length - 1].level;

        const downloadJob: DownloadJob = {
            id: generate(),
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
        // console.log('calling checkDownloadJobStatus')

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

                    if (res.jobStatus === 'esriJobSucceeded') {
                        status = 'finished';
                    } else if (res.jobStatus === 'esriJobFailed') {
                        status = 'failed';
                    }

                    return {
                        ...existingJobData,
                        status,
                    };
                }
            );

            dispatch(downloadJobsUpdated(updatedJobsData));

            // call this thunk function again in case there are still pending jobs left
            dispatch(checkPendingDownloadJobStatus);
        }, CHECK_JOB_STATUS_DELAY_IN_SECONDS * 1000);
    };
