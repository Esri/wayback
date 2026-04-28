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

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18nextLocalesLoader from 'i18next-http-backend';
import { format } from 'date-fns';

/**
 * load the locale files from `./public/locales/` for the current page
 * and initiate i18next library
 *
 * @returns void
 */
export const initI18next = async (language = 'en') => {
    // Set the HTML document's language attribute to the current app language
    // This helps with the ArcGIS API to display the content in the correct language
    if (language !== 'en') {
        document.documentElement.lang = language;
    }

    // get the "last-modified" meta tag, which gets added to 'index.html' file during the build process by webpack
    const lastModifiedMetaTag = document.querySelector(
        'meta[name="last-modified"]'
    );
    // console.log('lastModifiedMetaTag', lastModifiedMetaTag);

    // get the content from 'last-modified' meta tag or use a placeholder value in case the "last-modified" meta tag is not found.
    const lastModifiedTimestamp =
        lastModifiedMetaTag?.getAttribute('content') ||
        format(new Date(), 'yyyy-MM-dd');

    const i18nextLocalesLoader = new I18nextLocalesLoader(null, {
        loadPath: `./public/i18n/{{lng}}/{{ns}}.json?modified=${lastModifiedTimestamp}`,
    });

    await i18next
        .use(i18nextLocalesLoader)
        .use(initReactI18next)
        .init({
            lng: language,
            /**
             * set this to true so that locale will be fully lowercased,
             * otherwise it will convert "pt-br" to "pt-BR" which can cause issue
             * when load the locale files
             */
            lowerCaseLng: true,
            load: 'currentOnly',
            fallbackLng: 'en',
            ns: ['common'],
            defaultNS: 'common',
        });
};
