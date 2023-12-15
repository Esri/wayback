import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    downloadJobRemoved,
    isDownloadDialogOpenToggled,
} from '@store/DownloadMode/reducer';

import {
    selectDownloadJobs,
    selectIsAddingNewDownloadJob,
    selectIsDownloadDialogOpen,
    selectNumOfPendingDownloadJobs,
} from '@store/DownloadMode/selectors';

import { DownloadDialog } from './DownloadDialog';
import { useDispatch } from 'react-redux';
import { updateHashParams } from '@utils/UrlSearchParam';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';
import { saveDownloadJobs2LocalStorage } from '@utils/LocalStorage';
import {
    checkPendingDownloadJobStatus,
    startDownloadJob,
    updateUserSelectedZoomLevels,
    downloadOutputTilePackage,
    cleanUpDownloadJobs,
} from '@store/DownloadMode/thunks';

export const DownloadDialogContainer = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector(selectIsDownloadDialogOpen);

    const jobs = useSelector(selectDownloadJobs);

    const numPendingJobs = useSelector(selectNumOfPendingDownloadJobs);

    const isAddingNewDownloadJob = useSelector(selectIsAddingNewDownloadJob);

    useEffect(() => {
        // save jobs to localhost so they can be restored
        saveDownloadJobs2LocalStorage(jobs);

        // prompt anonymouns user to sign in if the user wants to open the download dialog,
        // since exporting job requires the user token
        if (jobs?.length && isAnonymouns() && isOpen) {
            signIn();
        }
    }, [jobs, isOpen]);

    useEffect(() => {
        updateHashParams('downloadMode', isOpen ? 'true' : null);
    }, [isOpen]);

    useEffect(() => {
        if (numPendingJobs) {
            dispatch(checkPendingDownloadJobStatus());
        }
    }, [numPendingJobs]);

    useEffect(() => {
        if (!isOpen) {
            dispatch(cleanUpDownloadJobs());
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <DownloadDialog
            jobs={jobs}
            isAddingNewDownloadJob={isAddingNewDownloadJob}
            closeButtonOnClick={() => {
                dispatch(isDownloadDialogOpenToggled());
            }}
            removeButtonOnClick={(id) => {
                dispatch(downloadJobRemoved(id));
            }}
            levelsOnChange={(id, levels) => {
                // console.log(id, levels);
                dispatch(updateUserSelectedZoomLevels(id, levels));
            }}
            createTilePackageButtonOnClick={(id: string) => {
                dispatch(startDownloadJob(id));
            }}
            downloadTilePackageButtonOnClick={(id: string) => {
                dispatch(downloadOutputTilePackage(id));
            }}
        />
    );
};
