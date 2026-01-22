/**
 * Key used to store the user's locale preference in localStorage.
 */
const LOCALE_PREFERENCE_KEY = 'wayback_locale_preference';

/**
 * Key used to store the user's preference for disabling locale suggestions in localStorage.
 */
const LOCALE_SUGGESTION_DISABLED_KEY = 'wayback_locale_suggestion_disabled';

/**
 * Key used to retrieve the locale from URL search parameters.
 */
const LOCALE_SEARCH_PARAM_KEY = 'lang';

/**
 * Languages/locales supported by the application.
 * This is derived from the ENV_SUPPORTED_LANGUAGES environment variable.
 * If the variable is not set, defaults to ['en'].
 */
export const SUPPORTED_LOCALES =
    ENV_SUPPORTED_LANGUAGES && Array.isArray(ENV_SUPPORTED_LANGUAGES)
        ? ENV_SUPPORTED_LANGUAGES
        : ['en'];
// console.log('Supported locales:', SUPPORTED_LOCALES);

/**
 * Cache for the application language to avoid redundant computations.
 */
let cachedAppLanguage: string | null = null;

/**
 * Retrieves the application language from the URL query parameters or localstorage.
 *
 * This function looks for the "lang" query parameter in the current URL.
 * If the parameter is found, its value is returned in lowercase.
 * If the parameter is not found, 'en' is returned as the default language.
 *
 * @returns {string} The language code from the URL query parameter or 'en' if not found.
 */
export const getAppLanguage = () => {
    if (cachedAppLanguage) {
        return cachedAppLanguage;
    }

    // get the "lang" query parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const localeFromSearchParams =
        searchParams.get(LOCALE_SEARCH_PARAM_KEY) || '';

    // get the locale preference from localStorage
    const localeFromLocalStorage =
        localStorage.getItem(LOCALE_PREFERENCE_KEY) || '';

    const lang = normalizeLocale(
        localeFromSearchParams || localeFromLocalStorage,
        SUPPORTED_LOCALES
    );

    // if the lang query parameter is found and is supported, return it
    if (lang) {
        return (cachedAppLanguage = lang);
    }

    // if the lang query parameter is not found or not supported, return 'en' as the default language
    return (cachedAppLanguage = 'en');
};

/**
 * Formats and validates a locale code against a list of supported locales.
 *
 * - If the input `locale` is falsy, returns an empty string.
 * - If the locale contains an underscore (e.g., 'en_US'), only the part before the underscore is used (e.g., 'en').
 * - The locale code is converted to lowercase.
 * - If `supportedLocales` is provided and does not include the formatted locale, returns an empty string.
 * - Otherwise, returns the formatted locale code.
 *
 * @param locale - The locale code to format (e.g., 'en_US', 'fr').
 * @param supportedLocales - An array of supported locale codes (in lowercase, e.g., ['en', 'fr']).
 * @returns The formatted locale code if valid and supported, otherwise an empty string.
 */
const normalizeLocale = (
    locale: string,
    supportedLocales: string[]
): string => {
    if (!locale) {
        return '';
    }

    locale = locale.split('-')[0]; // handle cases like 'en-US' by taking only 'en'
    locale = locale.toLowerCase();

    if (supportedLocales && !supportedLocales.includes(locale)) {
        return '';
    }

    return locale;
};

/**
 * Suggests the most appropriate locale for the application based on user and browser preferences.
 *
 * The function checks for the browser's language setting and normalizes it.
 * If the normalized locale is supported, it is returned. Otherwise, 'en' is returned as the default locale.
 *
 * @returns {string} The suggested locale code (e.g., 'en', 'es', etc.).
 */
export const getSuggestedLocale = () => {
    // // get the locale preference from localStorage
    // const userPreferredLocale = localStorage.getItem(LOCALE_PREFERENCE_KEY) || '';

    // let lang = normalizeLocale(userPreferredLocale, supportedLocales);

    // if(lang){
    //     return lang;
    // }

    // get the browser's language setting
    const browserLocale = navigator.language || '';

    // normalize and validate the browser locale
    // if it's not supported, an empty string will be returned
    const suggestedLocale = normalizeLocale(browserLocale, SUPPORTED_LOCALES);

    // return the suggested locale or default to 'en'
    return suggestedLocale || 'en';
};

/**
 * Sets the preferred locale by updating the URL query parameter and localStorage.
 * It also reloads the page to apply the language change.
 * @param lang - The language code to set in the URL.
 * @returns void
 */
export const setPreferredLocale = (lang: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    // Format the lang to lowercase and handle 'en' as default
    const langFormatted = normalizeLocale(lang, SUPPORTED_LOCALES);

    // update the lang query parameter in the URL and localStorage
    // if lang is empty or 'en', remove the query parameter and localStorage item
    // otherwise, set them to the formatted lang value
    if (!langFormatted || langFormatted === 'en') {
        searchParams.delete(LOCALE_SEARCH_PARAM_KEY);
        localStorage.removeItem(LOCALE_PREFERENCE_KEY);
    } else {
        searchParams.set(LOCALE_SEARCH_PARAM_KEY, langFormatted);
        localStorage.setItem(LOCALE_PREFERENCE_KEY, langFormatted);
    }

    // construct the new URL with updated query parameters
    const newRelativePathQuery =
        window.location.pathname +
        '?' +
        searchParams.toString() +
        window.location.hash;
    window.history.replaceState(null, '', newRelativePathQuery);
    window.location.reload();
};

/**
 * Save the user's preference for disabling locale suggestions in localStorage.
 * @param shouldDisable {boolean} - Whether to disable locale suggestions.
 * @returns void
 */
export const setLocaleSuggestionPreferenceInLocalstorage = (
    shouldDisable: boolean
) => {
    if (shouldDisable) {
        localStorage.setItem(LOCALE_SUGGESTION_DISABLED_KEY, 'true');
    } else {
        localStorage.removeItem(LOCALE_SUGGESTION_DISABLED_KEY);
    }
};

/**
 * Get the user's preference for disabling locale suggestions from localStorage.
 * @returns {boolean} - True if locale suggestions are disabled, false otherwise.
 */
export const getLocaleSuggestionPreferenceFromLocalstorage = (): boolean => {
    const value = localStorage.getItem(LOCALE_SUGGESTION_DISABLED_KEY);
    return value === 'true';
};
