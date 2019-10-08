import "./style/index.scss";

import "@babel/polyfill";

// required by ArcGIS REST JS 
import "isomorphic-fetch";
import "es6-promise";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import { isDevMode } from './utils/Tier';

const initApp = async()=>{

    const isDev = isDevMode();

    try {

        ReactDOM.render(
            <App
                isDev={isDev}
            />, 
            document.getElementById('appRootDiv')
        );

    } catch(err){
        console.error(err);
    }

};

initApp();