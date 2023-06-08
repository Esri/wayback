import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isDownloadDialogOpenToggled } from '../../store/reducers/DownloadMode/reducer';

import { selectIsDownloadDialogOpen } from '../../store/reducers/DownloadMode/selectors';

import { DownloadDialog } from './DownloadDialog';
import { useDispatch } from 'react-redux';
import { updateHashParams } from '../../utils/UrlSearchParam';
import { isAnonymouns, signIn } from '../../utils/Esri-OAuth';

export const DownloadDialogContainer = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector(selectIsDownloadDialogOpen);

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
            closeButtonOnClick={() => {
                dispatch(isDownloadDialogOpenToggled());
            }}
        />
    );
};
