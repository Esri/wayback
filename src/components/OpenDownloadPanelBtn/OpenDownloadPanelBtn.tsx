import { isDownloadDialogOpenToggled } from '@store/DownloadMode/reducer';
import {
    selectNumOfDownloadJobs,
    selectNumOfFinishedDownloadJobs,
    selectNumOfPendingDownloadJobs,
} from '@store/DownloadMode/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { IndicatorBubble } from '@components/IndicatorBubble/IndicatorBubble';

export const OpenDownloadPanelBtn = () => {
    const dispatch = useDispatch();

    const numOfJobs = useSelector(selectNumOfDownloadJobs);

    // const numOfPendingJobs = useSelector(selectNumOfPendingDownloadJobs);

    const numOfFinishedJobs = useSelector(selectNumOfFinishedDownloadJobs);

    const getIndicator = () => {
        if (!numOfJobs) {
            return null;
        }

        return (
            <IndicatorBubble>
                {numOfFinishedJobs === numOfJobs ? (
                    // use "check" icon from calcite icons
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="12"
                        height="12"
                    >
                        <path
                            fill="currentColor"
                            d="M5.5 12L2 8.689l.637-.636L5.5 10.727l8.022-7.87.637.637z"
                        />
                        <path fill="none" d="M0 0h16v16H0z" />
                    </svg>
                ) : (
                    <span>{numOfJobs}</span>
                )}
            </IndicatorBubble>
        );
    };

    return (
        <div
            className={classnames(
                'relative w-full text-center my-3 cursor-pointer z-10',
                {
                    disabled: numOfJobs === 0,
                }
            )}
            title={
                'download local copies of imagery tiles via the release row item'
            }
            onClick={() => {
                dispatch(isDownloadDialogOpenToggled());
            }}
        >
            <calcite-icon icon="download-to" scale="l" />
            {getIndicator()}
        </div>
    );
};
