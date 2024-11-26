import {
    navigatorLanguageToReferenceLayerLanguage,
    ReferenceLayerLanguage,
} from '@constants/map';
import {
    selectReferenceLayerLocale,
    suggestedReferenceLayerLocaleUpdated,
} from '@store/Map/reducer';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// Function to map navigator.language to the ReferenceLayerLanguage enum
const getReferenceLayerLanguage = (
    browserLanguage: string
): ReferenceLayerLanguage | undefined => {
    if (navigatorLanguageToReferenceLayerLanguage[browserLanguage]) {
        return navigatorLanguageToReferenceLayerLanguage[browserLanguage];
    }

    // Normalize to base language, e.g. 'en-US' -> 'en'
    const baseLanguage = browserLanguage.split('-')[0];

    return navigatorLanguageToReferenceLayerLanguage[baseLanguage];
};

export const useSuggestReferenceLayerLocale = () => {
    const dispatch = useDispatch();

    const borswerLanguage = navigator.language;

    const suggestReferenceLayerLocale = useMemo(() => {
        const referenceLayerLanguage =
            getReferenceLayerLanguage(borswerLanguage);
        console.log('suggested referenceLayerLanguage', referenceLayerLanguage);

        return referenceLayerLanguage;
    }, [borswerLanguage]);

    const selectedReferenceLayerLanguage = useSelector(
        selectReferenceLayerLocale
    );

    useEffect(() => {
        if (!suggestReferenceLayerLocale) {
            return;
        }

        // English is the default language so we don't need to suggest it
        if (suggestReferenceLayerLocale === ReferenceLayerLanguage.English) {
            return;
        }

        // If the suggested language is the same as the selected language, we don't need to do anything
        if (suggestReferenceLayerLocale === selectedReferenceLayerLanguage) {
            return;
        }

        dispatch(
            suggestedReferenceLayerLocaleUpdated(suggestReferenceLayerLocale)
        );
    }, [suggestReferenceLayerLocale, selectedReferenceLayerLanguage]);
};
