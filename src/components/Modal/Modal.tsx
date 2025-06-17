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

import React, { FC } from 'react';
import classnames from 'classnames';
import { CalciteButton } from '@esri/calcite-components-react';

type Props = {
    isOpen: boolean;
    width?: 's' | 'm' | 'l';
    onClose: () => void;
    children?: React.ReactNode;
};

export const Modal: FC<Props> = ({
    isOpen,
    width = 'm',
    children,
    onClose,
}) => {
    if (!isOpen) {
        return null;
    }
    return (
        <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center z-50"
            style={{
                background: `radial-gradient(circle, rgba(26,61,96,0.95) 50%, rgba(13,31,49,0.95) 100%)`,
            }}
        >
            <div
                className={classnames(
                    'relative mx-8 bg-custom-modal-content-background p-2 py-8',
                    {
                        'max-w-5xl': width === 'l',
                        'max-w-3xl': width === 'm',
                        'max-w-xl': width === 's',
                    }
                )}
            >
                <div className="absolute right-1 top-1">
                    <CalciteButton
                        icon-start="x"
                        scale="l"
                        appearance="transparent"
                        kind="neutral"
                        onClick={onClose}
                    />
                </div>

                <div className="px-8 pb-2 w-auto max-h-[500px] overflow-y-auto overflow-x-hidden fancy-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};
