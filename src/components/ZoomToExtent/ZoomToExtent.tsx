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

import { MapActionButton } from '@components/MapView/MapActionButton';
import classNames from 'classnames';
import React, { FC } from 'react';

type Props = {
    /**
     * tooltip text for the button
     */
    tooltip?: string;
    /**
     * emit when user click on
     * @returns void
     */
    onClick: () => void;
};

export const ZoomToExtent: FC<Props> = ({ tooltip, onClick }) => {
    return (
        <MapActionButton
            showLoadingIndicator={false}
            disabled={false}
            tooltip={tooltip}
            onClickHandler={onClick}
        >
            <>
                {/* extent icon */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 32 32"
                    >
                        <path
                            stroke="currentColor"
                            d="M28 4h-6V3h7v7h-1zM4 10H3V3h7v1H4zm6 19H3v-7h1v6h6zm12-1h6v-6h1v7h-7z"
                        />
                        <path fill="none" d="M0 0h32v32H0z" />
                    </svg>
                </div>

                {/* search icon */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill="currentColor"
                            d="M13.936 13.24L9.708 9.01a4.8 4.8 0 1 0-.69.69l4.228 4.228a.488.488 0 0 0 .69-.69zM6.002 9.8A3.8 3.8 0 1 1 8.69 8.686a3.778 3.778 0 0 1-2.687 1.112z"
                        />
                        <path fill="none" d="M0 0h16v16H0z" />
                    </svg>
                </div>
            </>
        </MapActionButton>
    );
};
