import '@arcgis/core/assets/esri/themes/dark/main.css';
import './style/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from '@store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';
import { AppLayout } from '@components/index';
import { initEsriOAuth } from '@utils/Esri-OAuth';
import config from './app-config';
import { getCustomPortalUrl } from '@utils/LocalStorage';
import { getServiceUrl, isDevMode } from '@utils/Tier';
import {
    getWaybackItems,
    setDefaultWaybackOptions,
} from '@vannizhang/wayback-core';

(async () => {
    try {
        await initEsriOAuth({
            appId: config.appId,
            portalUrl: getCustomPortalUrl() || getServiceUrl('portal-url'),
        });

        if (isDevMode) {
            setDefaultWaybackOptions({
                useDevServices: true,
            });
        }

        const waybackItems = await getWaybackItems();
        // console.log(waybackItems)

        const preloadedState = await getPreloadedState(waybackItems);

        const root = createRoot(document.getElementById('appRootDiv'));

        root.render(
            <ReduxProvider store={configureAppStore(preloadedState)}>
                <AppContextProvider>
                    <AppLayout />
                </AppContextProvider>
            </ReduxProvider>
        );
    } catch (err) {
        console.error(err);
    }
})();
