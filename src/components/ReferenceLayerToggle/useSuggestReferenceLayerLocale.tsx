import {
    navigatorLanguageToReferenceLayerLanguage,
    ReferenceLayerLanguage,
} from '@constants/map';
import {
    selectReferenceLayerLocale,
    suggestedReferenceLayerLocaleUpdated,
} from '@store/Map/reducer';
import { getPreferredReferenceLayerLocale } from '@utils/LocalStorage';
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

/**
 * Custom React hook designed to manage and suggest a locale for reference layers based on the user's browser settings and preferences.
 */
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
        const preferredReferenceLayerLocale =
            getPreferredReferenceLayerLocale();

        // Determine if a suggestion update is necessary
        if (
            !suggestReferenceLayerLocale || // Browser language is unsupported
            suggestReferenceLayerLocale === ReferenceLayerLanguage.English || // English is default, no need to suggest
            suggestReferenceLayerLocale === selectedReferenceLayerLanguage || // Already using the suggested language
            preferredReferenceLayerLocale // User already has a preferred language
        ) {
            dispatch(suggestedReferenceLayerLocaleUpdated(null)); // Clear the suggestion
            return;
        }

        dispatch(
            suggestedReferenceLayerLocaleUpdated(suggestReferenceLayerLocale)
        );
    }, [suggestReferenceLayerLocale, selectedReferenceLayerLanguage]);
};
