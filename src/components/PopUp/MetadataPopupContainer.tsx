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
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

import {
    metadataPopupAnchorSelector,
    metadataQueryResultSelector,
    metadataQueryResultUpdated,
    selectIsQueringMetadata,
} from '@store/Map/reducer';

import MetadataPopUp from './index';

const MetadataPopupContainer = () => {
    const dispatch = useAppDispatch();

    const metadata = useAppSelector(metadataQueryResultSelector);

    const anchorPoint = useAppSelector(metadataPopupAnchorSelector);

    const isQueryingMetadata = useAppSelector(selectIsQueringMetadata);

    const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    if (isAnimationModeOn) {
        return null;
    }

    return (
        <MetadataPopUp
            metadata={metadata}
            isQueryingMetadata={isQueryingMetadata}
            metadataAnchorScreenPoint={anchorPoint}
            onClose={() => {
                dispatch(metadataQueryResultUpdated(null));
            }}
        />
    );
};

export default MetadataPopupContainer;
