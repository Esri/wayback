import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    downloadJobRemoved,
    isDownloadDialogOpenToggled,
} from '@store/DownloadMode/reducer';

import {
    selectDownloadJobs,
    selectIsDownloadDialogOpen,
} from '@store/DownloadMode/selectors';

import { DownloadDialog } from './DownloadDialog';
import { useDispatch } from 'react-redux';
import { updateHashParams } from '@utils/UrlSearchParam';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';
import { saveDownloadJobs2LocalStorage } from '@utils/LocalStorage';
import { updateUserSelectedZoomLevels } from '@store/DownloadMode/thunks';

export const DownloadDialogContainer = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector(selectIsDownloadDialogOpen);

    const jobs = useSelector(selectDownloadJobs);

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
        />
    );
};
