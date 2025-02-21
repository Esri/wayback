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

import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    isGutterHideSelector,
    isSideBarHideSelector,
    isSideBarHideToggled,
} from '@store/UI/reducer';

import MobileFooter from './MobileFooter';
import { IS_MOBILE } from '@constants/UI';

const MobileFooterContainer = () => {
    const dispatch = useAppDispatch();
    const isGutterHide = useAppSelector(isGutterHideSelector);
    const isSideBarHide = useAppSelector(isSideBarHideSelector);

    if (!isSideBarHide || IS_MOBILE === false) {
        return null;
    }

    return (
        <MobileFooter
            isGutterHide={isGutterHide}
            OnClick={() => {
                dispatch(isSideBarHideToggled());
            }}
        />
    );
};

export default MobileFooterContainer;
