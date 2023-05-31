import './style/index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from './store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';

import WaybackManager from './core/WaybackManager';

import { AppLayout } from './components/';

(async () => {
    const root = createRoot(document.getElementById('appRootDiv'));

    try {
        const waybackManager = new WaybackManager();

        const waybackData2InitApp = await waybackManager.init();

        const preloadedState = await getPreloadedState(
            waybackData2InitApp.waybackItems
        );

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
