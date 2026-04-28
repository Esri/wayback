/* Copyright 2024-2026 Esri
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
    CalciteIcon,
    CalciteLoader,
    CalciteTooltip,
} from '@esri/calcite-components-react';
import { nanoid } from 'nanoid';
import React, { FC } from 'react';

type Props = {
    title: string;
    tooltip: string;
    showLoadingIndicator?: boolean;
};
export const HeaderText: FC<Props> = ({
    title,
    tooltip,
    showLoadingIndicator,
}) => {
    if (!title) return null;

    const tooltipAnchorId = nanoid();

    return (
        <div className="relative flex items-center text-custom-theme-blue-light">
            <div className="flex items-center justify-center w-4 h-4 mr-1">
                {showLoadingIndicator ? (
                    <CalciteLoader inline scale="s" />
                ) : (
                    <>
                        <CalciteIcon
                            id={tooltipAnchorId}
                            icon="information"
                            scale="s"
                        />

                        <CalciteTooltip
                            referenceElement={tooltipAnchorId}
                            overlayPositioning="fixed"
                            placement="bottom-start"
                            closeOnClick={true}
                        >
                            <div
                                className="max-w-[260px]"
                                dangerouslySetInnerHTML={{
                                    __html: tooltip,
                                }}
                            ></div>
                        </CalciteTooltip>
                    </>
                )}
            </div>

            <h4 className=" text-xl ">{title}</h4>
        </div>
    );
};
