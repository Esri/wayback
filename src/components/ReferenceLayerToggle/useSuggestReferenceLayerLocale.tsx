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
import { useAppSelector } from '@store/configureStore';
import { useAppDispatch } from '@store/configureStore';

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
    const dispatch = useAppDispatch();

    const borswerLanguage = navigator.language;

    const suggestedReferenceLayerLocale = useMemo(() => {
        const referenceLayerLanguage =
            getReferenceLayerLanguage(borswerLanguage);
        console.log('suggested referenceLayerLanguage', referenceLayerLanguage);

        return referenceLayerLanguage;
    }, [borswerLanguage]);

    const selectedReferenceLayerLanguage = useAppSelector(
        selectReferenceLayerLocale
    );

    useEffect(() => {
        const preferredReferenceLayerLocale =
            getPreferredReferenceLayerLocale();

        // Determine if a suggestion update is necessary
        if (
            !suggestedReferenceLayerLocale || // Browser language is unsupported
            suggestedReferenceLayerLocale === ReferenceLayerLanguage.English || // English is default, no need to suggest
            suggestedReferenceLayerLocale ===
                ReferenceLayerLanguage.EnglishUS ||
            suggestedReferenceLayerLocale === selectedReferenceLayerLanguage || // Already using the suggested language
            preferredReferenceLayerLocale // User already has a preferred language
        ) {
            dispatch(suggestedReferenceLayerLocaleUpdated(null)); // Clear the suggestion
            return;
        }

        dispatch(
            suggestedReferenceLayerLocaleUpdated(suggestedReferenceLayerLocale)
        );
    }, [suggestedReferenceLayerLocale, selectedReferenceLayerLanguage]);
};
