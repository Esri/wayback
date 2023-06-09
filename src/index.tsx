import './style/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from '@store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';
import WaybackManager from './core/wayback';
import { AppLayout } from '@components/index';
import { initEsriOAuth, isAnonymouns, signIn } from '@utils/Esri-OAuth';
import config from './app-config';
import { getCustomPortalUrl } from '@utils/LocalStorage';
import { getServiceUrl } from '@utils/Tier';

(async () => {
    try {
        await initEsriOAuth({
            appId: config.appId,
            portalUrl: getCustomPortalUrl() || getServiceUrl('portal-url'),
        });

        const waybackManager = new WaybackManager();

        const waybackData2InitApp = await waybackManager.init();

        const preloadedState = await getPreloadedState(
            waybackData2InitApp.waybackItems
        );

        const root = createRoot(document.getElementById('appRootDiv'));

        root.render(
            <ReduxProvider store={configureAppStore(preloadedState)}>
                <AppContextProvider waybackManager={waybackManager}>
                    <AppLayout />
                </AppContextProvider>
            </ReduxProvider>
        );
    } catch (err) {
        console.error(err);
    }
})();
