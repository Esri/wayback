import "./style/index.scss";

import "@babel/polyfill";
import "es6-promise";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';

const initApp = async()=>{

    try {

        ReactDOM.render(
            <App/>, 
            document.getElementById('appRootDiv')
        );

    } catch(err){
        console.error(err);
    }

};

initApp();