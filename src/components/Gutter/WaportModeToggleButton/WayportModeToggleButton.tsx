/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import { isDownloadDialogOpenToggled } from '@store/WayportMode/reducer';
import {
    selectNumOfDownloadJobs,
    selectNumOfFinishedWayportJobs,
    selectNumOfOngoingJobs,
    selectNumOfWayportJobsNotStarted,
} from '@store/WayportMode/selectors';
import React from 'react';
import { useAppSelector } from '@store/configureStore';
import { useAppDispatch } from '@store/configureStore';
import classnames from 'classnames';
import { IndicatorBubble } from '@components/IndicatorBubble/IndicatorBubble';
import { CalciteIcon, CalciteLoader } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';
// import {
//     isDownloadDialogOpenToggled,
//     isDownloadTilePackageDialogOpenSelector,
// } from '@store/UI/reducer';
// import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import { selectIsWayportModeOn } from '@store/Map/reducer';
import { toggleWayportMode } from '@store/WayportMode/thunks';

export const WaportModeToggleButton = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    /**
     * Number of jobs that are in "wayport job not started" status.
     * It will be displayed in the indicator bubble to indicate how many jobs are waiting to be started. T
     */
    const numOfJobsNotStarted = useAppSelector(
        selectNumOfWayportJobsNotStarted
    );

    const numOfJobs = useAppSelector(selectNumOfDownloadJobs);

    const numOfFinishedJobs = useAppSelector(selectNumOfFinishedWayportJobs);

    const numOfOngoingJobs = useAppSelector(selectNumOfOngoingJobs);

    /**
     * Show check icon when there are jobs and all of them are finished. If there are jobs but not all of them are finished, show the number of jobs. If there are no jobs, show nothing.
     */
    const showCheckIcon =
        numOfJobs > 0 &&
        numOfOngoingJobs === 0 &&
        numOfFinishedJobs === numOfJobs;

    const isWayportModeOn = useAppSelector(selectIsWayportModeOn);

    const getIndicator = () => {
        if (!numOfJobs) {
            return null;
        }

        let indicatorContent = null;

        const showCounter = numOfJobsNotStarted > 0 || numOfOngoingJobs > 0;

        if (showCheckIcon) {
            indicatorContent = (
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
            );
        } else if (showCounter) {
            indicatorContent = (
                <span>{numOfJobsNotStarted || numOfOngoingJobs}</span>
            );
        }

        if (!indicatorContent) {
            return null;
        }

        return <IndicatorBubble>{indicatorContent}</IndicatorBubble>;
    };

    return (
        <div
            className={classnames(
                'relative w-full text-center py-2 px-1 cursor-pointer z-10',
                // {
                //     disabled: numOfJobs === 0,
                // }
                {
                    // 'opacity-50 pointer-events-none': shouldDisableActionButton,
                    'bg-black text-white': isWayportModeOn,
                    // disabled: shouldDisableActionButton,
                }
            )}
        >
            <button
                className="relative flex mx-auto items-center justify-center"
                title={
                    // shouldBeDisabled
                    //     ? t('open_download_panel_button_tooltip_disabled')
                    //     : t('open_download_panel_button_tooltip')
                    t('open_download_panel_button_tooltip')
                }
                aria-label={t('open_download_panel_button_tooltip')}
                onClick={() => {
                    // if (shouldDisableActionButton) {
                    //     return;
                    // }
                    // dispatch(isDownloadDialogOpenToggled());
                    dispatch(toggleWayportMode());
                }}
            >
                <CalciteIcon icon="export" scale="l" />
            </button>
            {getIndicator()}
        </div>
    );
};
