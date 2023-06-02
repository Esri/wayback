import React from 'react';
import { useSelector } from 'react-redux';
import {
    isDownloadDialogOpenToggled,
    selectIsDownloadDialogOpen,
} from '../../store/reducers/DownloadMode';
import { DownloadDialog } from './DownloadDialog';
import { useDispatch } from 'react-redux';

export const DownloadDialogContainer = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector(selectIsDownloadDialogOpen);

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
