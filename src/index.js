import * as calcite from 'calcite-web'
import * as esriLoader from 'esri-loader'

import './style/index.scss';

calcite.init();

// first, we use Dojo's loader to require the map class
esriLoader.loadModules(['esri/views/MapView', 'esri/WebMap'])
.then(([MapView, WebMap]) => {
    // then we load a web map from an id
    var webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
        id: 'f2e9b762544945f390ca4ac3671cfa72'
        }
    });
    // and we show that map in a container w/ id #viewDiv
    var view = new MapView({
        map: webmap,
        container: 'app'
    });
})
.catch(err => {
    // handle any errors
    console.error(err);
});