import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectFinishedDownloadJobsWithoutPackageInfo,
    selectNumOfPendingDownloadJobs,
} from '@store/DownloadMode/selectors';
import {
    assignTilePackageInfoToDownloadJobs,
    checkPendingDownloadJobStatus,
    clearDownloadJobs,
} from '@store/DownloadMode/thunks';
import React, { use, useEffect } from 'react';

const CHECK_JOB_STATUS_INTERVAL = 5 * 1000; // 5 seconds

/**
 * This custom hook is used to check the status of pending download jobs at a regular interval, and update the job status in the store based on the response from Wayport GP service.
 * The interval will only be active when there is at least one pending download job, and will be cleared when there is no pending download job or when the component using this hook unmounts.
 */
export const useCheckStatusOfDownloadJobs = () => {
    // get the count of pending download jobs from the store
    const countOfPendingDownloadJobs = useAppSelector(
        selectNumOfPendingDownloadJobs
    );

    // get the list of finished download jobs that don't have tile package info assigned yet
    const finishedDownloadJobsWithoutPackageInfo = useAppSelector(
        selectFinishedDownloadJobsWithoutPackageInfo
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        // if there is no pending download job, there is no need to check the status of download jobs
        if (countOfPendingDownloadJobs === 0) {
            // console.log('No pending download job, skip checking job status');
            return;
        }

        // check the status of pending download jobs every 30 seconds
        const checkDownloadJobStatusInterval = setInterval(() => {
            // dispatch the thunk action to check the status of pending download jobs
            dispatch(checkPendingDownloadJobStatus());
        }, CHECK_JOB_STATUS_INTERVAL);

        // cleanup: clear the interval when countOfPendingDownloadJobs changes or component unmounts
        return () => {
            clearInterval(checkDownloadJobStatusInterval);
        };
    }, [countOfPendingDownloadJobs]);

    useEffect(() => {
        // Skip if there is no finished download job that needs to have tile package info assigned
        if (finishedDownloadJobsWithoutPackageInfo.length === 0) {
            // console.log('No finished download job without package info, skip assigning tile package info to download jobs');
            return;
        }

        dispatch(
            assignTilePackageInfoToDownloadJobs(
                finishedDownloadJobsWithoutPackageInfo
            )
        );
    }, [finishedDownloadJobsWithoutPackageInfo]);

    useEffect(() => {
        // clear download jobs that has been downloaded or failed, or has been finished for more than 1 hour, to keep the download list clean.
        dispatch(clearDownloadJobs());
    }, []);
};
