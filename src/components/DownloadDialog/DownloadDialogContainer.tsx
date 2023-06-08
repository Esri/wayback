import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isDownloadDialogOpenToggled } from '@store/DownloadMode/reducer';

import {
    selectDownloadJobs,
    selectIsDownloadDialogOpen,
} from '@store/DownloadMode/selectors';

import { DownloadDialog } from './DownloadDialog';
import { useDispatch } from 'react-redux';
import { updateHashParams } from '@utils/UrlSearchParam';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';

export const DownloadDialogContainer = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector(selectIsDownloadDialogOpen);

    const jobs = useSelector(selectDownloadJobs);

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
        />
    );
};
