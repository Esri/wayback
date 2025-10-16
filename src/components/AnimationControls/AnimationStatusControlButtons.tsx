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

import {
    CalciteButton,
    CalciteIcon,
    CalciteLoader,
} from '@esri/calcite-components-react';
import { AnimationStatus } from '@store/AnimationMode/reducer';
import React, { FC, useEffect } from 'react';

type Props = {
    status: AnimationStatus | null;
    // onClick: () => void;
    /**
     * Emits when user clicks the download button
     * @returns void
     */
    downloadButtonOnClick: () => void;
    /**
     * Emits when user clicks the copy link button
     * @returns void
     */
    copyLinkButtonOnClick: () => void;
    /**
     * Emits when user clicks the play/pause/close button
     * @param status The new status. If null, it means user wants to stop the animation.
     * @returns void
     */
    statusOnChanged: (status: AnimationStatus | null) => void;
};

// const PlayBtn = (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 16 16"
//         height="16"
//         width="16"
//     >
//         <path d="M4 1.571l10 6.43-10 6.428z" fill="#ccc" />
//         <path fill="none" d="M0 0h16v16H0z" />
//     </svg>
// );

// const PauseBtn = (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 16 16"
//         height="16"
//         width="16"
//     >
//         <path d="M2 1h5v14H2zm12 0H9v14h5z" fill="#ccc" />
//         <path fill="none" d="M0 0h16v16H0z" />
//     </svg>
// );

type ControlButtonProps = {
    icon: string;
    label: string;
    onClick: () => void;
};

const ControlButton: FC<ControlButtonProps> = ({ icon, label, onClick }) => {
    return (
        <button
            aria-label={label}
            className="p-1 hover:bg-gray-50 hover:bg-opacity-5 flex items-center justify-center"
            onClick={onClick}
            title={label}
            type="button"
        >
            <CalciteIcon icon={icon} />
        </button>
    );
};

export const AnimationStatusControlButtons: React.FC<Props> = ({
    status,
    statusOnChanged,
    downloadButtonOnClick,
    copyLinkButtonOnClick,
}: Props) => {
    // const getIcon = () => {
    //     // if (status === 'loading') {
    //     //     return <CalciteLoader inline />;
    //     // }

    //     if(status === 'playing'){
    //         return PauseBtn;
    //     }

    //     return PlayBtn;
    // };
    // return (
    //     <div
    //         className="mr-2 cursor-pointer"
    //         style={{
    //             display: 'flex',
    //         }}
    //         onClick={onClick}
    //     >
    //         {getIcon()}
    //     </div>
    // );

    return (
        <div className="flex items-center">
            {(status === 'playing' || status === 'pausing') && (
                <>
                    {/* <CalciteButton
                        appearance="transparent"
                        kind="neutral"
                        iconStart="link"
                        label="Copy Link to Clipboard"
                        scale="s"
                        onClick={copyLinkButtonOnClick}
                    /> */}

                    <ControlButton
                        icon="link"
                        label="Copy Link to Clipboard"
                        onClick={copyLinkButtonOnClick}
                    />

                    {/* <CalciteButton
                        appearance="transparent"
                        kind="neutral"
                        iconStart="download-to"
                        label="Download Animation"
                        scale="s"
                        onClick={downloadButtonOnClick}
                    /> */}
                    <ControlButton
                        icon="download-to"
                        label="Download Animation"
                        onClick={downloadButtonOnClick}
                    />
                </>
            )}

            {
                // when there is no status, show play button to start loading animation frames
                !status && (
                    // <CalciteButton
                    //     appearance="transparent"
                    //     kind="neutral"
                    //     iconStart="play"
                    //     label="Start Animation"
                    //     scale="s"
                    //     onClick={statusOnChanged.bind(null, 'loading')}
                    // />
                    <ControlButton
                        icon="play"
                        label="Start Animation"
                        onClick={statusOnChanged.bind(null, 'loading')}
                    />
                )
            }

            {
                // when animation is playing, show pause button to pause the animation
                status === 'playing' && (
                    // <CalciteButton
                    //     appearance="transparent"
                    //     kind="neutral"
                    //     iconStart="pause"
                    //     label="Pause Animation"
                    //     scale="s"
                    //     onClick={statusOnChanged.bind(null, 'pausing')}
                    // />
                    <ControlButton
                        icon="pause"
                        label="Pause Animation"
                        onClick={statusOnChanged.bind(null, 'pausing')}
                    />
                )
            }

            {
                // when animation is paused, show play button to resume the animation
                status === 'pausing' && (
                    // <CalciteButton
                    //     appearance="transparent"
                    //     kind="neutral"
                    //     iconStart="play"
                    //     label="Resume Animation"
                    //     scale="s"
                    //     onClick={statusOnChanged.bind(null, 'playing')}
                    // />
                    <ControlButton
                        icon="play"
                        label="Resume Animation"
                        onClick={statusOnChanged.bind(null, 'playing')}
                    />
                )
            }

            {status === 'loading' && <CalciteLoader inline />}

            {
                // when there is a status, show close button to stop the animation
                status && (
                    // <CalciteButton
                    //     appearance="transparent"
                    //     kind="neutral"
                    //     iconStart="x-circle"
                    //     label="Stop Animation"
                    //     scale="s"
                    //     onClick={statusOnChanged.bind(null, null)}
                    // />
                    <ControlButton
                        icon="x-circle"
                        label="Stop Animation"
                        onClick={statusOnChanged.bind(null, null)}
                    />
                )
            }
        </div>
    );
};

// export default PlayPauseBtn;
