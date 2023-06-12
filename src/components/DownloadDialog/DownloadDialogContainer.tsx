import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    downloadJobRemoved,
    isDownloadDialogOpenToggled,
} from '@store/DownloadMode/reducer';

import {
    selectDownloadJobs,
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
} from '@store/DownloadMode/thunks';
import { getJobOutput } from '@services/export-wayback-bundle/wayportGPService';

export const DownloadDialogContainer = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector(selectIsDownloadDialogOpen);

    const jobs = useSelector(selectDownloadJobs);

    const numPendingJobs = useSelector(selectNumOfPendingDownloadJobs);

    const downloadTilePackage = async (id: string) => {
        // const res = await getJobOutput(id)
        // const { url } = res.value;
        // window.open(url, '_blank');
    };

    useEffect(() => {
        // save jobs to localhost so they can be restored
        saveDownloadJobs2LocalStorage(jobs);
    }, [jobs]);

    useEffect(() => {
        updateHashParams('downloadMode', isOpen ? 'true' : null);

        if (isOpen && isAnonymouns()) {
            signIn();
        }
    }, [isOpen]);

    useEffect(() => {
        if (numPendingJobs) {
            dispatch(checkPendingDownloadJobStatus());
        }
    }, [numPendingJobs]);

    if (!isOpen) {
        return null;
    }

    return (
        <DownloadDialog
            jobs={jobs}
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
            downloadTilePackageButtonOnClick={downloadTilePackage}
        />
    );
};
