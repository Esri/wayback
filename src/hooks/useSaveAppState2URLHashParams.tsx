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

import React, { useEffect } from 'react';
import { useAppSelector } from '@store/configureStore';

import {
    animationSpeedSelector,
    selectAnimationStatus,
} from '@store/AnimationMode/reducer';
import {
    saveAnimationSpeedInURLQueryParam,
    saveMapModeInURLQueryParam,
} from '@utils/UrlSearchParam';
import { selectMapMode } from '@store/Map/reducer';

export const useSaveAppState2URLHashParams = () => {
    const animationSpeed = useAppSelector(animationSpeedSelector);

    const animationStatus = useAppSelector(selectAnimationStatus);

    const mode = useAppSelector(selectMapMode);

    useEffect(() => {
        saveAnimationSpeedInURLQueryParam(
            animationStatus !== null ? animationSpeed : undefined
        );
    }, [animationSpeed, animationStatus]);

    useEffect(() => {
        saveMapModeInURLQueryParam(mode);
    }, [mode]);
};
