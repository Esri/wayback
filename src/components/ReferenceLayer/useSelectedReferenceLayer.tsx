// import { HYBRID_REFERENCE_LAYERS } from '@constants/map';
// // import { selectReferenceLayerLocale } from '@store/Map/reducer';
// import React, { useMemo } from 'react';
// import { useAppSelector } from '@store/configureStore';
// import { selectAppLanguage } from '@store/UI/reducer';

// export const useSelecteReferenceLayer = () => {
//     const appLanguage = useAppSelector(selectAppLanguage);

//     const selectedLayer = useMemo(() => {
//         const layer = HYBRID_REFERENCE_LAYERS.filter(
//             (layer) => layer.languageCode === appLanguage
//         )[0];

//         if (layer) {
//             console.warn(
//                 'Could not find reference layer for app language:',
//                 appLanguage
//             );
//             return layer;
//         }

//         return (
//             HYBRID_REFERENCE_LAYERS.filter(
//                 (layer) => layer.languageCode === 'en'
//             )[0] || HYBRID_REFERENCE_LAYERS[0]
//         );
//     }, [appLanguage]);

//     return selectedLayer;
// };

/**
 * IMPORTANT - THE SECTION ABOVE IS THE UPDATED CODE THAT WE SHOULD USE ONCE THE APP LANGUAGE FEATURE IS READY TO BE RELEASED.
 *
 * THIS IS THE LEGACY CODE THAT WILL BE USED TEMPORARILY UNTIL WE ARE READY TO RELEASE THE APP LANGUAGE FEATURE.
 */
import { HYBRID_REFERENCE_LAYERS } from '@constants/map';
import { selectReferenceLayerLocale } from '@store/Map/reducer';
import React, { useMemo } from 'react';
import { useAppSelector } from '@store/configureStore';

export const useSelecteReferenceLayer = () => {
    const selectedReferenceLayerLanguage = useAppSelector(
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
