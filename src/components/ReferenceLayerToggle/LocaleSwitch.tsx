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

import {
    HYBRID_REFERENCE_LAYERS,
    ReferenceLayerLanguage,
} from '@constants/map';
import {
    // referenceLayerLocaleUpdated,
    selectReferenceLayerLocale,
} from '@store/Map/reducer';
import { updateReferenceLayerLocale } from '@store/Map/thunks';
// import { setPreferredReferenceLayerLocale } from '@utils/LocalStorage';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { CalciteIcon } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';

export const LocaleSwitch = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const selectedLocale = useAppSelector(selectReferenceLayerLocale);

    // useEffect(() => {
    //     setPreferredReferenceLayerLocale(selectedLocale);
    // }, [selectedLocale]);

    return (
        <div className="absolute w-full top-full px-2 text-sm bg-custom-background text-custom-foreground overflow-y-auto fancy-scrollbar max-h-[420px]">
            {HYBRID_REFERENCE_LAYERS.map((layer, index) => {
                const isSelected =
                    selectedLocale !== null
                        ? layer.language === selectedLocale
                        : layer.language === ReferenceLayerLanguage.EnglishUS;

                return (
                    <button
                        key={layer.id}
                        className="flex items-center my-2 w-full text-xs bg-custom-card-background cursor-pointer p-1"
                        onClick={() => {
                            dispatch(
                                updateReferenceLayerLocale(layer.language)
                            );
                        }}
                        aria-label={t('select_label_language', {
                            language: layer.language,
                        })}
                    >
                        {isSelected ? (
                            <CalciteIcon
                                icon="circle-f"
                                scale="s"
                            ></CalciteIcon>
                        ) : (
                            <CalciteIcon icon="circle" scale="s"></CalciteIcon>
                        )}
                        <span className="ml-2 mt-[2px]">{layer.language}</span>
                    </button>
                );
            })}
        </div>
    );
};
