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

// import { isDownloadDialogOpenToggled } from '@store/DownloadMode/reducer';
import {
    selectNumOfDownloadJobs,
    selectNumOfFinishedDownloadJobs,
    selectNumOfPendingDownloadJobs,
} from '@store/DownloadMode/selectors';
import React from 'react';
import { useAppSelector } from '@store/configureStore';
import { useAppDispatch } from '@store/configureStore';
import classnames from 'classnames';
import { IndicatorBubble } from '@components/IndicatorBubble/IndicatorBubble';
import { CalciteIcon } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';
import {
    isDownloadDialogOpenToggled,
    isDownloadTilePackageDialogOpenSelector,
} from '@store/UI/reducer';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

export const DownloadTilePackageDialogToggleButton = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const numOfJobs = useAppSelector(selectNumOfDownloadJobs);

    // const numOfPendingJobs = useAppSelector(selectNumOfPendingDownloadJobs);

    const numOfFinishedJobs = useAppSelector(selectNumOfFinishedDownloadJobs);

    const shouldBeDisabled = numOfJobs === 0;

    const isDownloadDialogOpen = useAppSelector(
        isDownloadTilePackageDialogOpenSelector
    );

    const animationModeOn = useAppSelector(isAnimationModeOnSelector);

    const shouldDisableActionButton = animationModeOn;

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
                'relative w-full text-center py-2 mb-1 px-1 cursor-pointer z-10',
                // {
                //     disabled: numOfJobs === 0,
                // }
                {
                    'opacity-50 pointer-events-none': shouldBeDisabled,
                    'bg-black text-white': isDownloadDialogOpen,
                    disabled: shouldDisableActionButton,
                }
            )}
        >
            <button
                className="relative flex mx-auto items-center justify-center"
                title={
                    shouldBeDisabled
                        ? t('open_download_panel_button_tooltip_disabled')
                        : t('open_download_panel_button_tooltip')
                }
                aria-label={t('toggle_download_panel')}
                onClick={() => {
                    if (shouldBeDisabled) {
                        return;
                    }
                    dispatch(isDownloadDialogOpenToggled());
                }}
            >
                <CalciteIcon icon="download-to" scale="l" />
            </button>
            {getIndicator()}
        </div>
    );
};
