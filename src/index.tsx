import "./style/index.scss";

import "@babel/polyfill";

// required by ArcGIS REST JS 
import "isomorphic-fetch";
import "es6-promise";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import { isDevMode } from './utils/Tier';
import { decodeSearchParam } from './utils/UrlSearchParam';

const initApp = async()=>{

    const isDev = isDevMode();

    const data2InitApp = decodeSearchParam();

    try {
        ReactDOM.render(
            <App
                data2InitApp={data2InitApp}
                isDev={isDev}
            />, 
            document.getElementById('appRootDiv')
        );

    } catch(err){
        console.error(err);
    }

};

initApp();