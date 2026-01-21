import { SUPPORTED_LOCALES } from '@utils/i18n/getAppLanguage';
import React from 'react';

type LocaleOption = {
    code: string;
    label: string;
};

const LOCAL_LABELS: { [key: string]: string } = {
    en: 'English',
    fr: 'Français (French)',
    de: 'Deutsch (German)',
    es: 'Español (Spanish)',
    ja: '日本語 (Japanese)',
    zh: '中文 (Chinese)',
    pt: 'Português (Portuguese)',
    ko: '한국어 (Korean)',
};

/**
 * Gets the display label for a given locale code.
 *
 * @param localeCode - The locale code to get the label for (e.g., 'en', 'fr', 'de')
 * @returns The display name of the locale, either from LOCAL_LABELS cache or generated
 *          using the Intl.DisplayNames API, or the locale code itself as fallback
 *
 * @example
 * getLocaleLabel('en') // Returns 'English'
 * getLocaleLabel('fr') // Returns 'French'
 */
const getLocaleLabel = (localeCode: string) => {
    if (LOCAL_LABELS[localeCode]) {
        return LOCAL_LABELS[localeCode];
    }

    const localeDisplayNames = new Intl.DisplayNames([localeCode], {
        type: 'language',
    });
    return localeDisplayNames.of(localeCode) || localeCode;
};

export const useLocaleOptions = () => {
    const options = React.useMemo<LocaleOption[]>(() => {
        return SUPPORTED_LOCALES.map((locale) => ({
            code: locale,
            label: getLocaleLabel(locale),
        }));
    }, []);
    return options;
};
