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

// import '@arcgis/core/assets/esri/themes/dark/main.css';
import './style/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import '@components/calcite-components';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from '@store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';

import { AppLayout } from '@components/index';
import { initEsriOAuth } from '@utils/Esri-OAuth';
import { getCustomPortalUrl } from '@utils/LocalStorage';
import { getArcGISOnlinePortalUrl, tier } from '@utils/Tier';
import { getWaybackItems, setDefaultWaybackOptions } from '@esri/wayback-core';
import { initI18next } from '@utils/i18n';
import { ErrorPage } from '@components/ErrorPage/ErrorPage';
import { initLogger } from '@utils/IndexedDBLogger';

(async () => {
    const root = createRoot(document.getElementById('appRootDiv'));

    try {
        await initEsriOAuth({
            appId: ARCGIS_OAUTH_CLIENT_ID,
            portalUrl: getCustomPortalUrl() || getArcGISOnlinePortalUrl(),
        });

        await initI18next();

        await initLogger();

        if (tier === 'development') {
            // Set the default wayback options for development mode
            setDefaultWaybackOptions({
                useDevServices: true,
            });
        }

        const waybackItems = await getWaybackItems();

        const preloadedState = await getPreloadedState(waybackItems);

        root.render(
            <ReduxProvider store={configureAppStore(preloadedState)}>
                <AppContextProvider>
                    <AppLayout />
                </AppContextProvider>
            </ReduxProvider>
        );
    } catch (err) {
        // console.error(err);
        root.render(
            <ErrorPage
                errorMessage={
                    err.message ||
                    'An error occurred while initializing the application.'
                }
            />
        );
    }
})();
