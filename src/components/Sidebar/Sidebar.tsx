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

import React from 'react';
// import { GUTTER_WIDTH, SIDEBAR_WIDTH } from '@constants/UI';

type Props = {
    isHide: boolean;
    isGutterHide: boolean;
    isMobile: boolean;
    children: React.ReactNode;
};

const Sidebar: React.FC<Props> = ({
    isHide,
    isGutterHide,
    isMobile,
    children,
}: Props) => {
    const getStyle = (): React.CSSProperties => {
        const defaultStyle: React.CSSProperties = {
            position: 'absolute',
            left: 'var(--gutter-width)',
            width: 'var(--sidebar-width)',
            height: '100%',
            padding: '1rem 0',
            paddingTop: '.5rem',
            // overflow: hidden;
            boxSizing: 'border-box',
            zIndex: 10,
            // padding: 1rem;
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignContent: 'stretch',
            alignItems: 'stretch',
            /**
             * stack two tight shadows for extra depth
             * First one is a a sharp inner glow,
             * second one is a slightly wider, softer halo
             */
            boxShadow: ` 0 0 4px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 0, 0, 0.4)`,
            borderTopLeftRadius: '10px 10px',
        };

        if (isMobile) {
            return {
                ...defaultStyle,
                position: 'absolute',
                top: 'auto',
                bottom: 0,
                right: 0,
                left: isGutterHide ? 0 : 'var(--gutter-width)',
                width: isGutterHide ? '100%' : 'calc(100% - 50px)',
                maxHeight: 400,
                padding: '.5rem 0',
                boxShadow: 'none',
            } as React.CSSProperties;
        }

        return defaultStyle;
    };

    if (isHide) {
        return null;
    }

    return (
        <div
            className="bg-custom-background top-header-height"
            style={getStyle()}
        >
            {children}
        </div>
    );
};

export default Sidebar;
