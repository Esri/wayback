import { useAppSelector } from '@store/configureStore';
import { selectMapResolution, selectMapScale } from '@store/Map/reducer';
import { numberWithCommas } from '@utils/snippets/numbers';
import React, { useMemo } from 'react';

export const MapScaleIndicator = () => {
    const mapScale = useAppSelector(selectMapScale);

    const mapResolution = useAppSelector(selectMapResolution);

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
                1:{mapScaleFormatted} | 1px: {mapResolutionFormatted}m
            </span>
        </div>
    );
};
