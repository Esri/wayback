import './style/index.scss';

import '@babel/polyfill';

// required by ArcGIS REST JS
import 'isomorphic-fetch';
import 'es6-promise';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import WaybackManager from './core/WaybackManager';
import App from './components/App';
import { decodeSearchParam } from './utils/UrlSearchParam';
import { miscFns } from 'helper-toolkit-ts';

const initApp = async () => {
    const isMobileDevice = miscFns.isMobileDevice();

    const data2InitApp = decodeSearchParam();

    const waybackManager = new WaybackManager();
    const waybackData2InitApp = await waybackManager.init();

    try {
        ReactDOM.render(
            <App
                data2InitApp={data2InitApp}
                isMobile={isMobileDevice}
                waybackManager={waybackManager}
                waybackData2InitApp={waybackData2InitApp}
            />,
            document.getElementById('appRootDiv')
        );
    } catch (err) {
        console.error(err);
    }
};

initApp();
