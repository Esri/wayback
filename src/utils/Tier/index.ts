import { ValidServiceUrlNames } from '../../types'
import config from '../../app-config';

const isHostedOnArcGisDomain = (()=>{
    return window.location.hostname.match(/arcgis.com/gi) ? true : false
})();

const isHostedOnLivingAtlasDomain = (()=>{
    return window.location.hostname.match(/livingatlas/gi) ? true : false
})();

// the wayback app is hosted on bothe Living Atlas dev and production server so the Living Atlas team can test the dev services using the dev app before we release them to production
// however, if the app is hosted on somewhere else, then just return false so the app will always use the production services
const isDevMode = (()=>{

    if(!config.developmentEnv){
        return false;
    }

    if(!isHostedOnArcGisDomain && !isHostedOnLivingAtlasDomain){
        return false;
    }

    const isDev = window.location.hostname !== 'livingatlas.arcgis.com' ? true : false;

    return isDev;
})();

const getServiceUrl = (key?:ValidServiceUrlNames)=>{
    const serviceUrls = isDevMode && config.developmentEnv.serviceUrls ? config.developmentEnv.serviceUrls: config.productionEnv.serviceUrls;
    return serviceUrls[key] || '';
};

export {
    getServiceUrl
};