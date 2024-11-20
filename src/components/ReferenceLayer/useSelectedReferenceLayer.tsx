import { HYBRID_REFERENCE_LAYERS } from '@constants/map';
import { selectReferenceLayerLocale } from '@store/Map/reducer';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useSelecteReferenceLayer = () => {
    const selectedReferenceLayerLanguage = useSelector(
        selectReferenceLayerLocale
    );

    const selectedLayer = useMemo(() => {
        const layer =
            HYBRID_REFERENCE_LAYERS.filter(
                (layer) => layer.language === selectedReferenceLayerLanguage
            )[0] || HYBRID_REFERENCE_LAYERS[0];

        return layer;
    }, [selectedReferenceLayerLanguage]);

    return selectedLayer;
};
