/* Copyright 2025 Esri
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

import './ScreenshotEffect.css';
import classNames from 'classnames';
import MapView from '@arcgis/core/views/MapView';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { delay } from '@utils/snippets/delay';
import { MapActionButton } from '@components/MapView/MapActionButton';
import { downloadBlob } from '@utils/snippets/downloadBlob';
import { imageDataToBlob } from '@utils/snippets/imageData2Blob';

type Props = {
    mapView?: MapView;
};

export const ScreenshotWidget: FC<Props> = ({ mapView }) => {
    const { t } = useTranslation();

    const [isCapturingScreenshot, setIsCapturingScreenshot] =
        useState<boolean>(false);

    const disabled = useMemo(() => {
        if (isCapturingScreenshot) {
            return true;
        }

        return false;
    }, [isCapturingScreenshot]);

    const onClickHandler = () => {
        (async () => {
            setIsCapturingScreenshot(true);

            // add a 2 seconds delay to let the capture screenshot effect play as smooth as possible
            // before `takeScreenshot` start, which can cause frame drops because it is a relatively heavy task
            await delay(1000);

            const screenshot = await mapView.takeScreenshot();

            const blob = await imageDataToBlob(screenshot.data);

            downloadBlob(blob, 'wayback-snapshot.png');

            setIsCapturingScreenshot(false);
        })();
    };

    return (
        <>
            <MapActionButton
                topMarging={4}
                showLoadingIndicator={isCapturingScreenshot}
                tooltip={t('save_map_view_as_image')}
                disabled={disabled}
                onClickHandler={onClickHandler}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height={24}
                    width={24}
                >
                    <path
                        fill="currentColor"
                        d="M14.5 17a4.5 4.5 0 1 0-4.5-4.5 4.505 4.505 0 0 0 4.5 4.5zm0-8a3.5 3.5 0 1 1-3.5 3.5A3.504 3.504 0 0 1 14.5 9zM8 9H4V8h4zm4 10.999V19h9a1.001 1.001 0 0 0 1-1V8a1.001 1.001 0 0 0-1-1h-1.5A1.502 1.502 0 0 1 18 5.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5A1.502 1.502 0 0 1 9.5 7H7V6H5v1H3a1.001 1.001 0 0 0-1 1v8H1V8a2.002 2.002 0 0 1 2-2h1V5h4v1h1.5a.5.5 0 0 0 .5-.5A1.502 1.502 0 0 1 11.5 4h6A1.502 1.502 0 0 1 19 5.5a.5.5 0 0 0 .5.5H21a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2zM6 23H5v-4.001H1V18h4v-4h1v4h4v.999H6z"
                    />
                    <path fill="none" d="M0 0h24v24H0z" />
                </svg>
            </MapActionButton>

            {isCapturingScreenshot && (
                <div
                    className={classNames(
                        'fixed top-0 left-0 bottom-0 w-full z-50 pointer-events-none screenshot-effect'
                    )}
                ></div>
            )}
        </>
    );
};
