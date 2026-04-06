import { ARCGIS_PROTAL_ROOT } from '@constants/index';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    checkUpdateTilesStatusThunk,
    publishTileLayerThunk,
    updateTilesOfWayportTileLayerThunk,
    waitTilePackageIsReadyToPublishThunk,
} from '@store/WayportMode/publishTileLayerThunks';
import {
    // selectFinishedWayportobsWithoutPackageInfo,
    selectNumOfPendingWayportJobs,
    selectReadyToBeDownloadedWayportJob,
    selectWayportJobReadyToBePublished,
    selectWayportJobReadyToHaveTilesUpdated,
    selectWayportJobUpdatingTiles,
    selectWayportJobWaiting4TilePackageToBeAdded,
} from '@store/WayportMode/selectors';
import {
    // assignTilePackageInfoToDownloadJobs,
    checkPendingWayportJobStatus,
    updateWayportJob,
    WAYPORT_JOB_TIME_TO_LIVE_IN_MILLISECONDS,
} from '@store/WayportMode/thunks';
import { getToken } from '@utils/Esri-OAuth';
import React, { use, useEffect, useMemo } from 'react';

const CHECK_JOB_STATUS_INTERVAL = 5 * 1000; // 5 seconds

/**
 * This custom hook is used to check the status of pending download jobs at a regular interval, and update the job status in the store based on the response from Wayport GP service.
 * The interval will only be active when there is at least one pending download job, and will be cleared when there is no pending download job or when the component using this hook unmounts.
 */
export const useManageStatusOfWayportJobs = () => {
    const dispatch = useAppDispatch();

    const token = getToken();

    // get the count of pending download jobs from the store
    const countOfPendingDownloadJobs = useAppSelector(
        selectNumOfPendingWayportJobs
    );

    const jobWaiting4TilePackageBeAdded = useAppSelector(
        selectWayportJobWaiting4TilePackageToBeAdded
    );

    const jobReadyToBePublished = useAppSelector(
        selectWayportJobReadyToBePublished
    );

    const jobReadyToHaveTilesUpdated = useAppSelector(
        selectWayportJobReadyToHaveTilesUpdated
    );

    const readyToBeDownloadedWayportJob = useAppSelector(
        selectReadyToBeDownloadedWayportJob
    );

    const jobUpdatingTile = useAppSelector(selectWayportJobUpdatingTiles);

    useEffect(() => {
        // if there is no pending download job, there is no need to check the status of download jobs
        if (countOfPendingDownloadJobs === 0) {
            // console.log('No pending download job, skip checking job status');
            return;
        }

        // check the status of pending download jobs every 30 seconds
        const checkDownloadJobStatusInterval = setInterval(() => {
            // dispatch the thunk action to check the status of pending download jobs
            dispatch(checkPendingWayportJobStatus());
        }, CHECK_JOB_STATUS_INTERVAL);

        // cleanup: clear the interval when countOfPendingDownloadJobs changes or component unmounts
        return () => {
            clearInterval(checkDownloadJobStatusInterval);
        };
    }, [countOfPendingDownloadJobs]);

    useEffect(() => {
        // if there is no job waiting for tile package to be added, there is no need to check the status of waiting for tile package to be added
        if (!jobWaiting4TilePackageBeAdded) {
            // console.log('No job waiting for tile package to be added, skip checking job status');
            return;
        }

        // check the status of download job waiting for tile package to be added every 30 seconds
        const checkJobWaiting4TilePackageBeAddedInterval = setInterval(() => {
            // dispatch the thunk action to check the status of download job waiting for tile package to be added
            dispatch(
                waitTilePackageIsReadyToPublishThunk({
                    jobId: jobWaiting4TilePackageBeAdded.id,
                    token,
                    portalRoot: ARCGIS_PROTAL_ROOT,
                })
            );
        }, CHECK_JOB_STATUS_INTERVAL);

        // cleanup: clear the interval when jobWaiting4TilePackageBeAdded changes or component unmounts
        return () => {
            clearInterval(checkJobWaiting4TilePackageBeAddedInterval);
        };
    }, [jobWaiting4TilePackageBeAdded]);

    useEffect(() => {
        // if there is no job ready to be published, there is no need to check the status of job ready to be published
        if (!jobReadyToBePublished) {
            // console.log('No job ready to be published, skip checking job status');
            return;
        }

        dispatch(
            publishTileLayerThunk({
                jobId: jobReadyToBePublished.id,
                token,
                portalRoot: ARCGIS_PROTAL_ROOT,
            })
        );
    }, [jobReadyToBePublished]);

    useEffect(() => {
        // if there is no job ready to have tiles updated, there is no need to check the status of job ready to have tiles updated
        if (!jobReadyToHaveTilesUpdated) {
            // console.log('No job ready to have tiles updated, skip checking job status');
            return;
        }

        dispatch(
            updateTilesOfWayportTileLayerThunk({
                jobId: jobReadyToHaveTilesUpdated.id,
                token,
            })
        );
    }, [jobReadyToHaveTilesUpdated]);

    useEffect(() => {
        // if there is no job updating tiles, there is no need to check the status of job updating tiles
        if (!jobUpdatingTile) {
            // console.log('No job updating tiles, skip checking job status');
            return;
        }

        const checkUpdateTilesStatusInterval = setInterval(() => {
            dispatch(
                checkUpdateTilesStatusThunk({
                    jobId: jobUpdatingTile.id,
                    token,
                })
            );
        }, CHECK_JOB_STATUS_INTERVAL);

        // cleanup: clear the interval when jobUpdatingTile changes or component unmounts
        return () => {
            clearInterval(checkUpdateTilesStatusInterval);
        };
    }, [jobUpdatingTile]);

    useEffect(() => {
        // if there is no ready to be downloaded job, there is no need to check the status of ready to be downloaded job
        if (!readyToBeDownloadedWayportJob) {
            // console.log('No ready to be downloaded job, skip checking job status');
            return;
        }

        if (
            !readyToBeDownloadedWayportJob.finishTime ||
            readyToBeDownloadedWayportJob.status !== 'wayport job finished'
        ) {
            // console.log('Ready to be downloaded job does not have finish time, skip checking if the job is expired');
            return;
        }

        const now = new Date().getTime();

        const isExpired =
            now - readyToBeDownloadedWayportJob.finishTime >
            WAYPORT_JOB_TIME_TO_LIVE_IN_MILLISECONDS; // 1 hour

        if (isExpired) {
            // console.log('Ready to be downloaded job has been finished for more than 1 hour, clear the job to keep the download list clean');
            dispatch(
                updateWayportJob({
                    jobId: readyToBeDownloadedWayportJob.id,
                    partialJobData: {
                        status: 'wayport job expired',
                    },
                })
            );
        }
    }, [readyToBeDownloadedWayportJob]);

    // useEffect(() => {
    //     // Skip if there is no finished download job that needs to have tile package info assigned
    //     if (finishedDownloadJobsWithoutPackageInfo.length === 0) {
    //         // console.log('No finished download job without package info, skip assigning tile package info to download jobs');
    //         return;
    //     }

    //     dispatch(
    //         assignTilePackageInfoToDownloadJobs(
    //             finishedDownloadJobsWithoutPackageInfo
    //         )
    //     );
    // }, [finishedDownloadJobsWithoutPackageInfo]);

    // useEffect(() => {
    //     // clear download jobs that has been downloaded or failed, or has been finished for more than 1 hour, to keep the download list clean.
    //     dispatch(clearWayportJobs());
    // }, []);
};
