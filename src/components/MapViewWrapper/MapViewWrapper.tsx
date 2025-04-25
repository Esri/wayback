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

import React, { useContext } from 'react';

import { useAppSelector } from '@store/configureStore';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import { AppContext } from '@contexts/AppContextProvider';
// import { isGutterHideSelector } from '@store/UI/reducer';

type Props = {
    children?: React.ReactNode;
};

const MapViewWrapper: React.FC<Props> = ({ children }) => {
    const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);

    // const isGutterHide = useAppSelector(isGutterHideSelector);

    const { isMobile } = useContext(AppContext);

    const getLeftPosition = (): string => {
        if (isMobile) {
            return '0';
        }

        if (isSwipeWidgetOpen) {
            return 'var(--gutter-width)';
        }

        return 'var(--gutter-sidebar-width)';
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: isMobile ? 45 : 0,
                bottom: 0,
                right: 0,
                left: getLeftPosition(),
                display: 'flex',
            }}
        >
            {children}
        </div>
    );
};

export default MapViewWrapper;
