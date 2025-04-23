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

import { isDownloadDialogOpenToggled } from '@store/DownloadMode/reducer';
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

export const OpenDownloadPanelBtn = () => {
    const dispatch = useAppDispatch();

    const numOfJobs = useAppSelector(selectNumOfDownloadJobs);

    // const numOfPendingJobs = useAppSelector(selectNumOfPendingDownloadJobs);

    const numOfFinishedJobs = useAppSelector(selectNumOfFinishedDownloadJobs);

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
            title={'Choose a version from the list to export a tile package'}
            onClick={() => {
                dispatch(isDownloadDialogOpenToggled());
            }}
        >
            <CalciteIcon icon="download-to" scale="l" />
            {getIndicator()}
        </div>
    );
};
