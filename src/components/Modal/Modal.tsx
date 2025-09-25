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

import React, { FC, JSX, ReactNode } from 'react';
import classnames from 'classnames';
import { CalciteButton } from '@esri/calcite-components-react';

type Props = {
    /**
     * Modal title
     */
    title: string | JSX.Element | ReactNode;
    isOpen: boolean;
    width?: 's' | 'm' | 'l' | 'xl';
    onClose: () => void;
    children?: React.ReactNode;
};

export const Modal: FC<Props> = ({
    title,
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
            className="absolute top-0 left-0 lg:left-gutter-width w-full h-full overflow-hidden flex items-center justify-center z-20 backdrop-blur-sm"
            style={{
                background: `radial-gradient(circle, rgba(26,61,96,0.95) 50%, rgba(13,31,49,0.95) 100%)`,
            }}
        >
            <div
                className={classnames(
                    'relative max-w-full h-auto bg-custom-modal-content-background ',
                    {
                        'md:max-w-6xl': width === 'xl',
                        'md:max-w-5xl': width === 'l',
                        'md:max-w-3xl': width === 'm',
                        'md:max-w-2xl': width === 's',
                    }
                )}
            >
                <div className="flex items-center justify-between pl-4 md:pl-8 pr-4 py-3 border-b border-b-white/10">
                    <header className="">
                        <span className="text-3xl">
                            {title || 'This is the Title'}
                        </span>
                    </header>
                    <CalciteButton
                        icon-start="x"
                        scale="l"
                        appearance="transparent"
                        kind="neutral"
                        onClick={onClose}
                    />
                </div>

                <div className="px-4 md:px-8 pb-8 pt-2 md:pt-4 max-h-[80vh] overflow-y-auto overflow-x-hidden fancy-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};
