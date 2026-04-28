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

import { useAppSelector } from '@store/configureStore';
import {
    selectMapCenterAndZoom,
    selectMapResolution,
    selectMapScale,
    selectMapZoomLevel,
} from '@store/Map/reducer';
import { numberWithCommas } from '@utils/snippets/numbers';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const MapScaleIndicator = () => {
    const { t } = useTranslation();

    const mapScale = useAppSelector(selectMapScale);

    const mapResolution = useAppSelector(selectMapResolution);

    const mapLevel = useAppSelector(selectMapZoomLevel);

    const mapScaleFormatted = useMemo(() => {
        if (mapScale === null || isNaN(mapScale)) {
            return null;
        }
        return numberWithCommas(+mapScale.toFixed(0));
    }, [mapScale]);

    const mapResolutionFormatted = useMemo(() => {
        if (mapResolution === null || isNaN(mapResolution)) {
            return null;
        }

        if (mapResolution >= 1) {
            return numberWithCommas(+mapResolution.toFixed(0));
        }

        return numberWithCommas(+mapResolution.toFixed(2));
    }, [mapResolution]);

    if (mapScaleFormatted === null || mapResolutionFormatted === null) {
        return null;
    }

    return (
        <div className="absolute bottom-[20px] right-[4px] px-1 py-[2px] text-xs bg-black bg-opacity-90 pointer-events-none">
            <span>
                1:{mapScaleFormatted} | {t('zoom_level', { level: mapLevel })} |
                1px: {mapResolutionFormatted}m
            </span>
        </div>
    );
};
