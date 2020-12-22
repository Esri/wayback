import './style/index.scss';

// import '@babel/polyfill';

// // required by ArcGIS REST JS
// import 'isomorphic-fetch';
// import 'es6-promise';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from './store/configureStore';
import AppContextProvider from './contexts/AppContextProvider';

import WaybackManager from './core/WaybackManager';
import {
    AppLayout
} from './components/';
// import { decodeSearchParam } from './utils/UrlSearchParam';

// import { setDefaultOptions } from 'esri-loader';
// setDefaultOptions({ url: 'https://js.arcgis.com/next/' });

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


