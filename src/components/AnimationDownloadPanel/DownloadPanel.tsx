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

import React, { FC, useEffect, useRef, useState } from 'react';
import IImageElement from '@arcgis/core/layers/support/ImageElement';
import { downloadBlob } from '@utils/snippets/downloadBlob';
import { DownloadOptionsList } from './DownloadOptionsList';
import { Dimension, PreviewWindow } from './PreviewWindow';
import { useSelector } from 'react-redux';
import { DownloadJobStatusInfo } from './DownloadJobStatus';
import { CloseButton } from '../CloseButton';
import { useDispatch } from 'react-redux';
// import { selectMapCenter } from '@shared/store/Map/selectors';
import { OpenDownloadPanelButton } from './OpenDownloadPanelButton';
import {
    convertImages2Video,
    AnimationFrameData,
} from '@vannizhang/images-to-video-converter-client';
import { APP_TITLE } from '@constants/strings';
import {
    selectShouldShowDownloadPanel,
    showDownloadAnimationPanelToggled,
} from '@store/AnimationMode/reducer';
import { CopyLinkButton } from './CopyLinkButton';
import { CopiedLinkMessage } from './CopiedLinkMessage';

// /**
//  * This object contains the data for each animation frame.
//  */
// export type AnimationFrameData4DownloadJob = {
//     /**
//      * The image element representing the median layer for this frame.
//      */
//     mediaLayerElement: IImageElement;
//     /**
//      * Additional information about this frame.
//      */
//     info: string;
// };

type Props = {
    /**
     * An array containing data representing the animation frames.
     */
    frameData4DownloadJob: AnimationFrameData[];
    /**
     * animation speed in millisecond
     */
    animationSpeed: number;
    /**
     * size of the map view window
     */
    mapViewWindowSize: Dimension;
};

/**
 * status of job to download animation as MP4
 */
export type DownloadJobStatus = 'pending' | 'finished' | 'cancelled' | 'failed';

export const AnimationDownloadPanel: FC<Props> = ({
    frameData4DownloadJob,
    animationSpeed,
    mapViewWindowSize,
}) => {
    const dispatch = useDispatch();

    const shouldShowDownloadPanel = useSelector(selectShouldShowDownloadPanel);

    const [previewWindowSize, setPreviewWindowSize] = useState<Dimension>(null);

    const [downloadJobStatus, setDownloadJobStatus] =
        useState<DownloadJobStatus>(null);

    const abortController = useRef<AbortController>();

    const downloadAnimation = async (outputVideoDimension: Dimension) => {
        setDownloadJobStatus('pending');

        const { width, height } = outputVideoDimension;

        try {
            if (abortController.current) {
                abortController.current.abort();
            }

            abortController.current = new AbortController();

            const { filename, fileContent } = await convertImages2Video({
                data: frameData4DownloadJob,
                animationSpeed,
                outputWidth: width,
                outputHeight: height,
                authoringApp: APP_TITLE,
                abortController: abortController.current,
            });

            downloadBlob(fileContent, filename);

            setDownloadJobStatus('finished');
        } catch (err) {
            console.log(err);

            // no need to set status to failed if error
            // is caused by the user aborting the pending job
            if (err.name === 'AbortError') {
                return;
            }

            setDownloadJobStatus('failed');
        }
    };

    useEffect(() => {
        if (!shouldShowDownloadPanel) {
            setPreviewWindowSize(null);
            setDownloadJobStatus(null);

            if (abortController.current) {
                abortController.current.abort();
            }
        }
    }, [shouldShowDownloadPanel]);

    if (!frameData4DownloadJob || !frameData4DownloadJob?.length) {
        return null;
    }

    return (
        <>
            <div className="absolute top-0 right-0 text-custom-light-blue z-10">
                {/* Download Button that opens the Download Animation Panel */}
                {shouldShowDownloadPanel === false && (
                    <>
                        <OpenDownloadPanelButton />
                        <CopyLinkButton />
                        <CopiedLinkMessage />
                    </>
                )}

                {downloadJobStatus !== null && (
                    <DownloadJobStatusInfo
                        status={downloadJobStatus}
                        cancelButtonOnClick={() => {
                            // close animation download panel will also cancel any
                            // pending tasks
                            dispatch(showDownloadAnimationPanelToggled(false));
                        }}
                        closeButtonOnClick={() => {
                            dispatch(showDownloadAnimationPanelToggled(false));
                        }}
                    />
                )}

                {shouldShowDownloadPanel && downloadJobStatus === null && (
                    <>
                        <DownloadOptionsList
                            onMouseEnter={(size) => {
                                if (!size) {
                                    return;
                                }

                                const [width, height] = size;

                                setPreviewWindowSize({
                                    width,
                                    height,
                                });
                                // console.log(size);
                            }}
                            onMouseLeave={setPreviewWindowSize.bind(null, null)}
                            onClick={(size) => {
                                if (!size) {
                                    return;
                                }

                                const [width, height] = size;

                                downloadAnimation({
                                    width,
                                    height,
                                });
                            }}
                        />

                        <CloseButton
                            onClick={() => {
                                dispatch(
                                    showDownloadAnimationPanelToggled(false)
                                );
                            }}
                        />
                    </>
                )}
            </div>

            {previewWindowSize && (
                <PreviewWindow
                    previewWindowSize={previewWindowSize}
                    mapViewWindowSize={mapViewWindowSize}
                />
            )}
        </>
    );
};
