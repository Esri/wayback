/* Copyright 2024 Esri
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
