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

import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import classnames from 'classnames';
import {
    showDownloadAnimationPanelToggled,
    selectAnimationStatus,
    // isLoadingFrameDataSelector,
} from '@store/AnimationMode/reducer';
import { CalciteButton } from '@esri/calcite-components-react';

export const DonwloadAnimationButton = () => {
    const dispatch = useAppDispatch();

    // const isLoadingFrameData = useAppSelector(isLoadingFrameDataSelector);

    const animationStatus = useAppSelector(selectAnimationStatus);

    const onClickHandler = useCallback(() => {
        dispatch(showDownloadAnimationPanelToggled(true));
    }, []);

    // const classNames = classnames('btn btn-fill', {
    //     'btn-disabled': animationStatus === 'loading',
    // });

    return (
        <div
            className={classnames({
                disabled:
                    animationStatus === 'loading' ||
                    animationStatus === 'failed',
            })}
        >
            <CalciteButton
                width="full"
                onClick={onClickHandler}
                style={{
                    '--calcite-color-text-inverse': '#efefef',
                }}
            >
                Download Animation
            </CalciteButton>
        </div>
    );
};
