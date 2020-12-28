import './style/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from './store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';

import WaybackManager from './core/WaybackManager';

import {
    AppLayout
} from './components/';

import { setDefaultOptions } from 'esri-loader';

setDefaultOptions({ 
    version: '4.18'
});

const initApp = async () => {

    const waybackManager = new WaybackManager();
    const waybackData2InitApp = await waybackManager.init();

    const preloadedState = await getPreloadedState(waybackData2InitApp.waybackItems);
    // console.log(preloadedState)

    try {
        ReactDOM.render(
            <React.StrictMode>
                <ReduxProvider store={configureAppStore(preloadedState)}>
                    <AppContextProvider
                        waybackManager={waybackManager}
                    >
                        <AppLayout />
                    </AppContextProvider>
                </ReduxProvider>
            </React.StrictMode>,
            document.getElementById('appRootDiv')
        );
    } catch (err) {
        console.error(err);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    initApp();
});


