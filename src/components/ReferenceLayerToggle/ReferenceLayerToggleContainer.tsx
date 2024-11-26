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

import React, { useCallback, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import {
    isReferenceLayerVisibleSelector,
    isReferenceLayerVisibleToggled,
} from '@store/Map/reducer';
// import { MobileHide } from '../MobileVisibility';

import ReferenceLayerToggle from './ReferenceLayerToggle';
import { IS_MOBILE } from '@constants/UI';
import { LocaleSwitch } from './LocaleSwitch';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { useSuggestReferenceLayerLocale } from './useSuggestReferenceLayerLocale';

const ReferenceLayerToggleContainer = () => {
    const dispatch = useDispatch();

    const containerRef = React.useRef<HTMLDivElement>(null);

    const isReferenceLayerVisible = useSelector(
        isReferenceLayerVisibleSelector
    );

    const toggleReferenceLayer = useCallback(() => {
        dispatch(isReferenceLayerVisibleToggled());
    }, []);

    const [isLocaleSwitchOpen, setIsLocaleSwitchOpen] = useState(false);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    useOnClickOutside(containerRef, () => {
        setIsLocaleSwitchOpen(false);
    });

    useSuggestReferenceLayerLocale();

    if (isAnimationModeOn || IS_MOBILE) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="absolute top-[15px] right-[15px] h-[32px] w-[240px] bg-custom-background text-custom-foreground"
        >
            <ReferenceLayerToggle
                isActive={isReferenceLayerVisible}
                onClick={toggleReferenceLayer}
                localeSwitchButtonOnClick={() => {
                    setIsLocaleSwitchOpen(!isLocaleSwitchOpen);
                }}
            />

            {isLocaleSwitchOpen && <LocaleSwitch />}
        </div>
    );
};

export default ReferenceLayerToggleContainer;
