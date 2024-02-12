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

import { useSelector } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import { SIDEBAR_WIDTH, GUTTER_WIDTH } from '@constants/UI';

import { AppContext } from '@contexts/AppContextProvider';
import { isGutterHideSelector } from '@store/UI/reducer';

type Props = {
    children?: React.ReactNode;
};

const MapViewWrapper: React.FC<Props> = ({ children }) => {
    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    const { isMobile } = useContext(AppContext);

    const getLeftPosition = (): number => {
        if (isMobile) {
            return isGutterHide ? 0 : GUTTER_WIDTH;
        }

        if (isSwipeWidgetOpen) {
            return GUTTER_WIDTH;
        }

        return SIDEBAR_WIDTH + GUTTER_WIDTH;
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
