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

/**
 * Loads Adobe Analytics script if the environment is suitable.
 * This function checks if the script can be loaded based on the current environment and hostname.
 *
 * @param {boolean} [hostedOnLivingAtlas=false] - Indicates if the application is hosted on Living Atlas.
 * @returns   {void}
 */
export const loadAdobeAnalytics = (hostedOnLivingAtlas = false) => {
    if (typeof window === 'undefined' || !window.document) {
        console.warn('Adobe Analytics cannot be loaded in this environment.');
        return;
    }

    if (hostedOnLivingAtlas === false) {
        // console.warn(
        //     'Adobe Analytics is only loaded on livingatlas.arcgis.com.'
        // );
        return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//mtags.arcgis.com/tags-min.js';
    document.head.appendChild(script);

    console.log('Adobe Analytics loaded successfully.');
};
