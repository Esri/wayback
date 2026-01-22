import { useAppSelector } from '@store/configureStore';
import { selectAppLanguage } from '@store/UI/reducer';
import {
    getLocaleSuggestionPreferenceFromLocalstorage,
    getSuggestedLocale,
    setLocaleSuggestionPreferenceInLocalstorage,
    setPreferredLocale,
    SUPPORTED_LOCALES,
} from '@utils/i18n/getAppLanguage';
import React, { useMemo } from 'react';
import { LocaleSuggestion } from './LocaleSuggestion';

export const LocaleSuggestionContainer = () => {
    // get the current app language from the store
    const appLanguage = useAppSelector(selectAppLanguage);

    // get the suggested locale
    const suggestedLocale = useMemo(() => {
        return getSuggestedLocale();
    }, []);

    /**
     * Check if the user has disabled locale suggestions.
     */
    const hasDisableLocaleSuggestion = useMemo(() => {
        return getLocaleSuggestionPreferenceFromLocalstorage();
    }, []);

    /**
     * determine whether it should suggest locale switch.
     * It should suggest locale switch if:
     * 1. the user has not disabled locale suggestion
     * 2. there is a suggested locale
     * 3. the suggested locale is different from the current app language
     * 4. there is more than one supported locale
     */
    const shouldSuggestLocale = useMemo(() => {
        return (
            SUPPORTED_LOCALES.length > 1 &&
            hasDisableLocaleSuggestion === false &&
            suggestedLocale &&
            suggestedLocale !== appLanguage
        );
    }, [hasDisableLocaleSuggestion, suggestedLocale, appLanguage]);

    const [shouHide, setShouHide] = React.useState<boolean>(
        shouldSuggestLocale === false
    );

    if (shouHide) {
        return null;
    }

    return (
        <div className="hidden md:flex absolute bottom-6 left-gutter-sidebar-width right-0 pointer-events-none z-10 justify-center items-center">
            <LocaleSuggestion
                suggestedLocale={suggestedLocale!}
                appLanguage={appLanguage}
                onClose={() => {
                    setShouHide(true);
                }}
                onAccept={() => {
                    setPreferredLocale(suggestedLocale!);
                }}
                onDisableSuggestion={(value) => {
                    setLocaleSuggestionPreferenceInLocalstorage(value);
                }}
            />
        </div>
    );
};
