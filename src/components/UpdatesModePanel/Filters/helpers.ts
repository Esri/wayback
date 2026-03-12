import { t } from 'i18next';

export const formatArea = (areaInSqKm: number, appLanguage: string) => {
    if (appLanguage !== 'en') {
        // For non-English languages, just return the area with no formatting
        return `${areaInSqKm.toFixed(0)}`;
    }

    if (areaInSqKm >= 1000000) {
        return `${(areaInSqKm / 1000000).toFixed(1)}M`;
    }

    if (areaInSqKm >= 1000) {
        return `${(areaInSqKm / 1000).toFixed(0)}K`;
    }

    return `${areaInSqKm.toFixed(0)}`;
};

export const getContryNameByCountryCode = (countryCode: string) => {
    if (!countryCode || countryCode.trim() === '') {
        return t('unknown_country');
    }

    const i18nKey = `COUNTRY_NAME_${countryCode.toUpperCase()}`;
    return t(i18nKey, { defaultValue: countryCode }); // Use the country code as the default value if the translation key is missing
};
