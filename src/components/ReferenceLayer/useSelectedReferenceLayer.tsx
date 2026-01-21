import { HYBRID_REFERENCE_LAYERS } from '@constants/map';
// import { selectReferenceLayerLocale } from '@store/Map/reducer';
import React, { useMemo } from 'react';
import { useAppSelector } from '@store/configureStore';
import { selectAppLanguage } from '@store/UI/reducer';

export const useSelecteReferenceLayer = () => {
    const appLanguage = useAppSelector(selectAppLanguage);

    const selectedLayer = useMemo(() => {
        const layer = HYBRID_REFERENCE_LAYERS.filter(
            (layer) => layer.languageCode === appLanguage
        )[0];

        if (layer) {
            console.warn(
                'Could not find reference layer for app language:',
                appLanguage
            );
            return layer;
        }

        return (
            HYBRID_REFERENCE_LAYERS.filter(
                (layer) => layer.languageCode === 'en'
            )[0] || HYBRID_REFERENCE_LAYERS[0]
        );
    }, [appLanguage]);

    return selectedLayer;
};
