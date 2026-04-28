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
