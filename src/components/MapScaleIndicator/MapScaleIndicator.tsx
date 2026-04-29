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

    const mapCenter = useAppSelector(selectMapCenterAndZoom)?.center;

    const mapScale = useAppSelector(selectMapScale);

    const mapResolution = useAppSelector(selectMapResolution);

    const mapLevel = useAppSelector(selectMapZoomLevel);

    const actualScale = useMemo(() => {
        if (mapScale === null || isNaN(mapScale) || mapCenter === null) {
            return null;
        }

        // get the latitude from the map center
        const latitude = mapCenter.lat;
        // This is the scale at the equator
        const nominalScale = mapScale;

        // Convert latitude to radians
        const latRadians = latitude * (Math.PI / 180);

        // Calculate the true scale denominator
        const trueScale = nominalScale * Math.cos(latRadians);

        return trueScale;
    }, [mapScale, mapCenter?.lat]);

    const actualResolution = useMemo(() => {
        if (
            mapResolution === null ||
            isNaN(mapResolution) ||
            mapCenter === null
        ) {
            return null;
        }

        // get the latitude from the map center
        const latitude = mapCenter.lat;
        // This is the resolution at the equator
        const nominalResolution = mapResolution;

        // Convert latitude to radians
        const latRadians = latitude * (Math.PI / 180);

        console.log('Calculating actual resolution:');
        console.log('Latitude (degrees):', latitude);
        console.log('Latitude (radians):', latRadians);
        console.log('Nominal resolution at equator:', nominalResolution);
        console.log('Cosine of latitude:', Math.cos(latRadians));
        console.log(
            'Actual resolution:',
            nominalResolution * Math.cos(latRadians)
        );

        // Calculate the true resolution
        const trueResolution = nominalResolution * Math.cos(latRadians);
        return trueResolution;
    }, [mapResolution, mapCenter?.lat]);

    const mapScaleFormatted = useMemo(() => {
        if (actualScale === null || isNaN(actualScale)) {
            return null;
        }
        return numberWithCommas(+actualScale.toFixed(0));
    }, [actualScale]);

    const mapResolutionFormatted = useMemo(() => {
        if (actualResolution === null || isNaN(actualResolution)) {
            return null;
        }

        if (actualResolution >= 1) {
            return numberWithCommas(+actualResolution.toFixed(0));
        }

        return numberWithCommas(+actualResolution.toFixed(2));
    }, [actualResolution]);

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
