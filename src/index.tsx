import './style/index.scss';

import '@babel/polyfill';

// required by ArcGIS REST JS
import 'isomorphic-fetch';
import 'es6-promise';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import configureAppStore, { getPreloadedState } from './store/configureStore';

import WaybackManager from './core/WaybackManager';
import App from './components/App';
import { decodeSearchParam } from './utils/UrlSearchParam';
import { miscFns } from 'helper-toolkit-ts';
import { setDefaultOptions } from 'esri-loader';

// setDefaultOptions({ url: 'https://js.arcgis.com/next/' });

const initApp = async () => {
    const isMobileDevice = miscFns.isMobileDevice();

    const data2InitApp = decodeSearchParam();

    const waybackManager = new WaybackManager();
    const waybackData2InitApp = await waybackManager.init();

    const preloadedState = await getPreloadedState(waybackData2InitApp.waybackItems);
    console.log(waybackData2InitApp)

    try {
        ReactDOM.render(
            <React.StrictMode>
                <ReduxProvider store={configureAppStore(preloadedState)}>
                    <App
                        data2InitApp={data2InitApp}
                        isMobile={isMobileDevice}
                        waybackManager={waybackManager}
                        waybackData2InitApp={waybackData2InitApp}
                    />
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


