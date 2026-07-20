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
    HYBRID_REFERENCE_LAYERS,
    ReferenceLayerLanguage,
} from '@constants/map';
// import { selectReferenceLayerLocale } from '@store/Map/reducer';
import React, { useMemo } from 'react';
import { useAppSelector } from '@store/configureStore';
import { selectAppLanguage } from '@store/UI/reducer';
import { selectShouldUseHybridReferenceLayer } from '@store/Map/reducer';

export const useSelecteReferenceLayer = () => {
    const appLanguage = useAppSelector(selectAppLanguage);

    const shouldUseHybridReferenceLayer = useAppSelector(
        selectShouldUseHybridReferenceLayer
    );

    const selectedLayer = useMemo(() => {
        // If the user has chosen to use the hybrid reference layer, return that layer regardless of the app language
        if (shouldUseHybridReferenceLayer) {
            return (
                HYBRID_REFERENCE_LAYERS.filter(
                    (layer) =>
                        layer.language === ReferenceLayerLanguage.LocalLanguage
                )[0] || HYBRID_REFERENCE_LAYERS[0]
            );
        }

        const layer = HYBRID_REFERENCE_LAYERS.filter(
            (layer) => layer.languageCode === appLanguage
        )[0];

        if (layer) {
            console.log(
                `Selected reference layer locale: ${layer.language} (${layer.languageCode})`
            );
            return layer;
        }

        return (
            HYBRID_REFERENCE_LAYERS.filter(
                (layer) => layer.languageCode === 'en'
            )[0] || HYBRID_REFERENCE_LAYERS[0]
        );
    }, [appLanguage, shouldUseHybridReferenceLayer]);

    return selectedLayer;
};
