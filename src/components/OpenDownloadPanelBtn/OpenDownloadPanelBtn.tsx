import { isDownloadDialogOpenToggled } from '@store/DownloadMode/reducer';
import React from 'react';
import { useDispatch } from 'react-redux';

export const OpenDownloadPanelBtn = () => {
    const dispatch = useDispatch();

    return (
        <div
            className="relative w-full text-center my-3 cursor-pointer z-10"
            onClick={() => {
                dispatch(isDownloadDialogOpenToggled());
            }}
        >
            <calcite-icon icon="download-to" scale="l" />
        </div>
    );
};
