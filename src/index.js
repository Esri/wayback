// import dependencies and libraries
import $ from 'jquery';
import * as d3 from "d3";
import * as esriLoader from 'esri-loader';
import * as calcite from 'calcite-web/dist/js/calcite-web';

import PopupInfoWindow from './ui-components/PopupInfoWindow';

// import style files
import './style/index.scss';

// import other files
import waybackAgolItemIds from './assets/wayback-lookup_2019.r00.json';

// import the polyfill for ES6-style Promises
const Promise = require('es6-promise').Promise;

const urlQueryParams = (function(){
    // parse the devMode data from location search params
    // http://localhost:8080/?devMode=true&baseUrl=https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer

    const outputData = {};

    const isDevServer = window.location.hostname === 'localhost' || window.location.hostname === 'livingatlasdev.arcgis.com' ? true : false;

    if(window.location.search){

        const locationSearchStr = window.location.search.substring(1);

        const locationSearchData = locationSearchStr.split('&');

        locationSearchData.forEach(function(d){
            d = d.split('=');
            const key = d[0];
            const val = d[1];
            outputData[key]=val;
        });

    } 

    outputData.devMode = outputData.devMode === 'true' || isDevServer ? true : false;

    return outputData;

})();

// app configs 
const OAUTH_APPID_DEV = '4Op8YK3SdKZEplai';
const OAUTH_APPID_PROD = 'WaybackImagery';

const ID_WEBMAP =  '86aa24cfcdf443109e3b7f2139ea6188';
const ID_WAYBACK_IMAGERY_LAYER = 'waybackImaegryLayer';

const URL_WAYBACK_IMAGERY_BASE = urlQueryParams.devMode && urlQueryParams.baseUrl ? urlQueryParams.baseUrl : 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const URL_WAYBACK_IMAGERY_TILES = URL_WAYBACK_IMAGERY_BASE + '/tile/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_TILEMAP = URL_WAYBACK_IMAGERY_BASE + '/tilemap/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_SELECT = URL_WAYBACK_IMAGERY_BASE + '?f=json';
const URL_WAYBACK_AGOL_ITEMS_LOOKUP_BASE = 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com';
const URL_WAYBACK_AGOL_ITEMS_LOOKUP = urlQueryParams.devMode ? URL_WAYBACK_AGOL_ITEMS_LOOKUP_BASE + '/dev/waybackconfig.json' : URL_WAYBACK_AGOL_ITEMS_LOOKUP_BASE + '/prd/waybackconfig.json';

const KEY_RELEASE_NUM = 'M';
const KEY_RELEASE_NAME = 'Name';

const DOM_ID_MAP_CONTAINER = 'mapDiv';
const DOM_ID_BARCHART = 'barChartDiv';
const DOM_ID_ITEMLIST = 'listCardsWrap';
const MODAL_ID_UPLAOD_WEBMAP = 'web-map-loading-indicator';

// before using esri-loader, tell it to use the promise library
esriLoader.utils.Promise = Promise;
const esriLoaderOptions = {
    url: 'https://js.arcgis.com/4.10'
};
esriLoader.loadModules([
    'esri/views/MapView', 
    'esri/WebMap',
    // "esri/geometry/Extent",
    "esri/geometry/Point",
    // "esri/Graphic",

    "esri/layers/BaseTileLayer",
    "esri/request",
    "esri/core/watchUtils",
    // "esri/geometry/geometryEngine",
    "esri/geometry/support/webMercatorUtils",
    
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/Portal",

    "esri/widgets/Search",

    "dojo/domReady!"
], esriLoaderOptions).then(([
    MapView, 
    WebMap,
    // Extent,
    Point,
    // Graphic,

    BaseTileLayer,
    esriRequest,
    watchUtils,
    // geometryEngine,
    webMercatorUtils,

    OAuthInfo, 
    esriId,
    Portal,

    Search
])=>{

    let app = null;
    let appView = null;
    let helper = null;
    // let waybackAgolItemIds = null;

    const WaybackApp = function(){

        this.dataModel = new AppDataModel();
        this.mapView = null;
        this.isMapViewStationary = false; 
        this.selectedTile = null; // tile element that is selected to search wayback imagery releases
        this.portalUser = null;
        this.stateManager = new AppStateManager();
        this.oauthManager = new OAuthManager();
        this.waybackMetadataManager = new WaybackMetadataManager();
        this.popupWindowAnchorMapPoint = null;

        this.init = ()=>{
            this.initMap();
            
            // this.fetchWaybackAgolItemsLookupTable((res)=>{
            //     waybackAgolItemIds = res;

            //     this.initMap();
            // });
        };

        this.fetchWaybackAgolItemsLookupTable = (callback)=>{
            $.getJSON(URL_WAYBACK_AGOL_ITEMS_LOOKUP, response=>{
                // this.waybackReleaseDataOnReadyHandler(response.Selection);
                callback(response);
            });
        };

        // get json file that will be used as a lookup table for all releases since 2014
        this.fetchWaybackReleasesData = ()=>{
            $.getJSON(URL_WAYBACK_IMAGERY_SELECT, response=>{
                this.waybackReleaseDataOnReadyHandler(response.Selection);
            });
        };

        this.waybackReleaseDataOnReadyHandler = (res)=>{
            // init app data model and wayback imagery layer
            this.initDataModel(res);
            this.initWaybackImageryLayer();
        };

        this.initMap = ()=>{
            // // then we load a web map from an id
            const webmap = new WebMap({
                portalItem: { // autocasts as new PortalItem()
                    id: ID_WEBMAP
                }
            });

            // and we show that map in a container w/ id #viewDiv
            const view = new MapView({
                map: webmap,
                container: DOM_ID_MAP_CONTAINER,
                constraints: {
                    rotationEnabled: false
                }
            });

            // check map ext from state manager, need to do this when user get redirect to the sign in page and direct back to app page, we want to make sure 
            // that it zooms back to the map extent before sign in
            const prevMapExt = this.stateManager.getMapExt();
            if(prevMapExt){
                view.extent = prevMapExt;
            }

            view.when(()=>{
                this.setMapView(view);
                this.setMapEventHandlers(view);
                this.initSearchWidget(view);
                this.fetchWaybackReleasesData();
            });
        };

        this.initDataModel = (data)=>{
            this.dataModel.init(data);
        };

        this.initWaybackImageryLayer = ()=>{
            const mostRecentRelease = this.dataModel.getMostRecentReleaseNum();
            const mapCenter = this.mapView.center;
            this.addWaybackImageryLayer(mostRecentRelease);
            this.searchWayback(mapCenter);
        };

        this.initSearchWidget = (view)=>{
            const searchWidget = new Search({
                view: view,
                resultGraphicEnabled: false,
                popupEnabled: false
            });

            view.ui.add(searchWidget, {
                position: "top-right",
                index: 0
            });
        };

        this.setMapView = (mapView)=>{
            this.mapView = mapView;
        };

        this.setMapCenter = (lat, lon)=>{
            const pt = new Point({
                longitude: lon,
                latitude: lat
            });
            this.mapView.center = pt;
        };

        this.setSelectedTile = (tileElement)=>{
            const topLeftScreenPoint = this.getScreenPointFromXY(tileElement.x, tileElement.y);

            this.selectedTile = new SelectedTileElement({
                topLeftScreenPoint: topLeftScreenPoint
            });
        };

        this.removeSelectedTile = ()=>{
            this.selectedTile = null;
        }

        this.getMapViewExtent = (isInGeoUnits)=>{
            const mapExt = isInGeoUnits ? webMercatorUtils.webMercatorToGeographic(this.mapView.extent) : this.mapView.extent;
            // const mapExtInGeoUnits = webMercatorUtils.webMercatorToGeographic(this.mapView.extent);
            return mapExt.toJSON();
        };

        this.setPortalUser = (portalUser)=>{
            this.portalUser = portalUser;
        };

        this.setPopupWindowAnchorMapPoint = (mapPoint=null)=>{
            this.popupWindowAnchorMapPoint = mapPoint;
        }

        this.toggleIsMapViewStationary = (isStationary)=>{
            this.isMapViewStationary = isStationary;

            if(!isStationary){
                appView.toggleMapLoader(true);
            } else {
                this.updateEventsOnEndHandler();
            }

        };

        this.addWaybackImageryLayer = (releaseNum)=>{

            // console.log('calling addWaybackImageryLayer');

            if(!releaseNum){
                console.error('release number ({m} value) is required to add wayback imagery layer');
                return;
            }

            const waybackLyr = new WaybackImageryLayer({
                id: ID_WAYBACK_IMAGERY_LAYER,
                urlTemplate: URL_WAYBACK_IMAGERY_TILES,
                m: releaseNum
            });

            // remove existing wayback layer
            this.removeWaybackImageryLayer();

            this.mapView.map.add(waybackLyr);

            this.mapView.map.reorder(waybackLyr, 0); //bring the layer to bottom so the labels are visible

            // this.getMetaData();
        };

        this.getWaybackImageryLayer = ()=>{
            const waybackLyr = this.mapView.map.findLayerById(ID_WAYBACK_IMAGERY_LAYER) || null;
            return waybackLyr;
        }

        this.getReleaseNumFromWaybackImageryLayer = ()=>{
            const waybackLyr = this.getWaybackImageryLayer();
            return +waybackLyr.m;
        };

        this.removeWaybackImageryLayer = ()=>{
            const waybackLyr = this.getWaybackImageryLayer();
            if(waybackLyr){
                this.mapView.map.remove(waybackLyr);
            }
        };

        this.setMapEventHandlers = (view)=>{

            view.on('click', (evt)=>{
                // this.searchWayback(evt.mapPoint);
                const mapPoint = evt.mapPoint;
                this.showPopupWindow(mapPoint);
            });

            view.on('mouse-wheel', (evt)=>{
                this.hidePopupWindow();
            });

            watchUtils.watch(view, "center", (evt)=>{
                // console.log('view center is on updating', evt);
                this.updatePopupPostion();
            });

            watchUtils.whenFalse(view, "stationary", (evt)=>{
                this.toggleIsMapViewStationary(false);
            });

            watchUtils.whenTrue(view, "stationary", (evt)=>{
                this.toggleIsMapViewStationary(true);
            });
        };

        this.showPopupWindow = (mapPoint)=>{

            this.getMetaData({ mapPoint }).then(metadata=>{

                const screenPoint = this.convertToScreenPoint(mapPoint);
                const releaseNum = metadata.releaseNum;

                const releaseDate = app.dataModel.getReleaseDate(releaseNum);
                const itemAgolUrl = app.dataModel.getItemAgolUrl(releaseNum);
                const isSelected = app.dataModel.getIsSelected(releaseNum); 

                metadata.releaseNum = releaseNum;
                metadata.releaseDate = releaseDate;
                metadata.itemAgolUrl = itemAgolUrl;
                metadata.isSelected = isSelected;

                // console.log('calling showPopupWindow', metadata);

                this.setPopupWindowAnchorMapPoint(mapPoint);

                appView.popupInfoWindow.show({
                    screenPoint,
                    metadata
                });
            });
        };

        this.hidePopupWindow = ()=>{
            // reset popup anchor point to null
            this.setPopupWindowAnchorMapPoint(); 
            appView.popupInfoWindow.hide();
        };

        this.updatePopupPostion = ()=>{
            if(this.popupWindowAnchorMapPoint){
                const screenPoint = this.convertToScreenPoint(this.popupWindowAnchorMapPoint);
                appView.popupInfoWindow.setPosition(screenPoint, true);
            }
        }

        // we need to watch both layerView on update and mapView on update events and execute search once both of these two updates events are finished
        this.updateEventsOnEndHandler = ()=>{
            // console.log('calling updateEventsOnEndHandler');
            if(this.isMapViewStationary && this.dataModel.isReady){
                this.searchWayback(this.mapView.center);
            }
        };

        // search all releases with updated data for tile image at given level, row, col
        this.searchWayback = (mapPoint=null)=>{

            this.removeSelectedTile();

            const level = this.mapView.zoom;

            const tileInfo = {
                level: level,
                row: helper.lat2tile(mapPoint.latitude, level),
                col: helper.long2tile(mapPoint.longitude, level)
            };

            const latFromTile = helper.tile2lat(tileInfo.row, level);
            const longFromTile = helper.tile2Long(tileInfo.col, level);
            const tileTopLeftXY = webMercatorUtils.lngLatToXY(longFromTile, latFromTile);

            this.setSelectedTile({
                x: tileTopLeftXY[0],
                y: tileTopLeftXY[1]
            });

            this.dataModel.getReleaseNumbersByLRC(tileInfo.level, tileInfo.row, tileInfo.col).then(releases=>{
                this.serachWaybackOnSuccessHandler(releases, tileInfo);
            });

            appView.toggleMapLoader(true);
        };

        this.removeReleasesWithDuplicates = (releasesData)=>{
            
            const finalResults = [];

            releasesData.reduce((accu, curr)=>{
                if(!accu.includes(curr.dataUri)){
                    accu.push(curr.dataUri);
                    finalResults.push(curr);
                }
                return accu;
            }, []);

            return finalResults;
        };

        this.serachWaybackOnSuccessHandler = (releasesNumbers, tileInfo)=>{

            const level = tileInfo.level;
            const row = tileInfo.row;
            const column = tileInfo.col;

            // download the tile image file using each release number in res, convert to to dataUri to so we can check if there are duplicated items
            const resolvedTileDataUriArray = releasesNumbers.map(rNum=>{
                const tileURL = this.getWaybackTileURL(rNum, level, row, column);
                return this.getImageBlob(tileURL, rNum);
            });

            // check and remove the duplicated items once DataUri for all images are resolved
            Promise.all(resolvedTileDataUriArray).then(resolvedResults => {

                resolvedResults = resolvedResults.reverse(); //reverse the array so we can start the comparison from the oldest tile to the newest to only keep the identical ones

                // remove duplicates only if the devMode is false
                if(!urlQueryParams.devMode){
                    resolvedResults = this.removeReleasesWithDuplicates(resolvedResults);
                }

                const releasesWithChanges = resolvedResults.map(d=>{
                    this.selectedTile.addImageUrlByReleaseNumber(d.release, d.imageUrl);
                    return d.release;
                })
                
                const releaseNumForActiveItem = this.getReleaseNumFromWaybackImageryLayer();
                const isViewDataSame = appView.viewModel.compareReleasesWithChanges(releasesWithChanges);

                if(!releasesWithChanges.length){
                    appView.toggleWaybakLayerLoadingFailedMsg(true);
                }

                if(!isViewDataSame){
                    const releasesToDisplay = this.dataModel.getFullListOfReleases(releasesWithChanges, releaseNumForActiveItem);

                    appView.updateViewModel(releasesToDisplay, ()=>{
                        if(this.stateManager.shouldRestore()){
                            this.stateManager.restore();
                        }
                    });

                } else {
                    appView.toggleMapLoader(false);
                }
            });
        };

        this.getMetaData = (options={})=>{
            const mapPoint = options.mapPoint || this.mapView.center;
            const releaseNum = options.releaseNum || this.getReleaseNumFromWaybackImageryLayer();
            const zoom = this.mapView.zoom;

            return new Promise((resolve, reject) => {
                this.waybackMetadataManager.getData(mapPoint, zoom, releaseNum).then(metadata=>{
                    resolve(metadata);
                }).catch(errorMsg=>{
                    console.error('cannot get metadata:', errorMsg);
                    reject({error: errorMsg});
                });
            });
        };

        this.getImageBlob = (imageURL, rNum)=>{

            return new Promise((resolve, reject) => {

                const releaseName = app.dataModel.getReleaseName(rNum);
            
                const xhr = new XMLHttpRequest();
                xhr.open('GET', imageURL, true);
                xhr.responseType = 'arraybuffer';
    
                xhr.onload = function(e) {
                    if (this.status == 200) {
                        const uInt8Array = new Uint8Array(this.response);
                        let i = uInt8Array.length;
                        const binaryString = new Array(i);
                        while (i--){
                            binaryString[i] = String.fromCharCode(uInt8Array[i]);
                        }
                        const data = binaryString.join('');
                        const base64 = window.btoa(data);
                        const tileImageDataUri = base64.substr(512,5000); 
                        // console.log(tileImageDataUri);
    
                        resolve({
                            release: rNum,
                            releaseName: releaseName,
                            dataUri: tileImageDataUri,
                            imageUrl: imageURL
                        });
                    }
                };
    
                xhr.send();
            });

        };

        this.getWaybackTileURL = (rNum, level, row, column, isReturnTileData)=>{
            return URL_WAYBACK_IMAGERY_TILES.replace("{m}", rNum).replace("{l}", level).replace("{r}", row).replace("{c}", column);
        };

        this.saveAsWebMap = (options, callback)=>{
            const selectedItems = app.dataModel.getSelectedItems().reverse(); // reverse the array so most recent releases will be on top of the webmap's table of content
            // const requestURL = this.portalUser.userContentUrl + '/addItem'; 
            const requestURL = this.oauthManager.getUserContentUrl() + '/addItem'; 
            const currentMapExtent = this.getMapViewExtent(true);

            const webMapTitle = options.title || ''; 
            const webMapDesc =  options.desc || '';
            const webMapSnippet = helper.getSnippetStr(selectedItems); // need to generate on the fly
            const webMaptags = options.tags || '';

            if(webMapTitle && webMaptags){

                const uploadRequestContent = {
                    'title': webMapTitle,
                    'snippet': webMapSnippet,
                    'description': webMapDesc, 
                    'tags': webMaptags,
                    'extent': [currentMapExtent.xmin, currentMapExtent.ymin, currentMapExtent.xmax, currentMapExtent.ymax].join(','),
                    'type': 'Web Map',
                    'overwrite': true,
                    'f': 'json'
                };
    
                const operationalLayers = [];
                
                selectedItems.forEach((d, i)=>{

                    const isVisible = i === 0 ? true : false;

                    const metadataLayerItemID = this.waybackMetadataManager.getMetadataItemID(d.release);
                    const metadataLayerUrl = this.waybackMetadataManager.getMetadataMapServiceUrl(d.release);

                    const waybackLayerInfo = {
                        "templateUrl": d.layerURL,
                        "wmtsInfo": {
                            "url": URL_WAYBACK_IMAGERY_BASE
                        },
                        "visibility": isVisible,
                        "title": d.releaseName,
                        "type": "WebTiledLayer",
                        "layerType": "WebTiledLayer",
                        "itemId": d.agolItemID
                    };

                    operationalLayers.push(waybackLayerInfo);

                    if(metadataLayerItemID && metadataLayerUrl){
                        const metadataLayerTitle = "Metadata for " + d.releaseName;

                        // const metadataLayerInfo = {
                        //     "layerType": "ArcGISTiledMapServiceLayer",
                        //     "url": metadataLayerUrl,
                        //     "visibility": isVisible,
                        //     "opacity": 1,
                        //     "title": metadataLayerTitle,
                        //     "layers": metadataSublayersInfo.layers
                        // };

                        const metadataLayerInfo = {
                            "itemId": metadataLayerItemID,
                            "visibility": isVisible,
                            "opacity": 1,
                            "title": metadataLayerTitle,
                            "layerType": "ArcGISMapServiceLayer",
                            "url": metadataLayerUrl
                        };

                        operationalLayers.push(metadataLayerInfo);
                    }

                });
    
                const requestText = {  
                    "operationalLayers": operationalLayers,
                    "baseMap":{  
                        "baseMapLayers":[  
                            {  
                                "id":"defaultBasemap",
                                "layerType":"ArcGISTiledMapServiceLayer",
                                "url":"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/",
                                "visibility": true,
                                "opacity": 1,
                                "title": "World Imagery"
                            },
                            {
                                "id": "World_Boundaries_and_Places",
                                "layerType": "ArcGISTiledMapServiceLayer",
                                "url": "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
                                "visibility": true,
                                "opacity": 1,
                                "title": "World Boundaries and Places",
                                "isReference": true
                            }
                        ],
                        "title":"Imagery with Labels"
                    },
                    "spatialReference":{"wkid":102100,"latestWkid":3857}
                };
    
                uploadRequestContent.text = JSON.stringify(requestText);
    
                esriRequest(requestURL, {
                    method: 'post',
                    query: uploadRequestContent,
                    responseType: "json"
                }).then(function(response){
                    callback(response.data);
                });
            }

        };

        this.getScreenPointFromXY = (x, y)=>{

            const pt = new Point({
                x: x,
                y: y,
                spatialReference: { wkid: 3857 }
            });

            return this.convertToScreenPoint(pt);
        };

        this.convertToScreenPoint = (mapPoint)=>{

            const xOffsetForMapDiv = 350; 

            const screenPt = this.mapView.toScreen(mapPoint);

            screenPt.x = screenPt.x + xOffsetForMapDiv; // need to add this offset because we have gutter and side bar at left of the page

            return screenPt;
        };

        this.toggleReferenceOverlay = ()=>{
            // console.log(this.mapView);

            this.mapView.allLayerViews.items.forEach(lyr=>{

                if(lyr.layer.title === 'Hybrid Reference Layer'){
                    lyr.visible = !lyr.visible;
                }
            });
        };

        // this.init();
    };

    const WaybackMetadataManager =  function(options={}){

        // can only get metadata when the map is between the min and max zoom level (10 <= mapZoom <= 23) 
        const MAX_ZOOM = 23;
        const MIN_ZOOM = 10;
        const FIELD_NAME_SRC_DATE = 'SRC_DATE2';
        const FIELD_NAME_SRC_PROVIDER = 'NICE_DESC';
        const FIELD_NAME_SRC_NAME = 'SRC_DESC';
        const FIELD_NAME_SRC_RES = 'SRC_RES';
        const FIELD_NAME_SRC_ACC = 'SRC_ACC';

        const getData = (mapPoint, zoom, releaseNum)=>{

            return new Promise((resolve, reject)=>{

                const metadataLayerUrl = getMetaDataLayerUrl(releaseNum, zoom);
            
                if(metadataLayerUrl){
                    queryData(metadataLayerUrl, mapPoint).then(res=>{
                        // console.log(res);
                        if(res){
                            res.releaseNum = releaseNum;
                            resolve(res);
                        } else {
                            reject('no metadata result from the query');
                        }
                        
                    });
                } else {
                    reject('no metadata layer available');
                }
            });
            
        };

        const queryData = (metadataLayerUrl, mapPoint)=>{

            const queryParam = {
                geometry: JSON.stringify({"x": mapPoint.x, "y":mapPoint.y, "spatialReference":{"wkid":102100,"latestWkid":3857}}),
                geometryType: 'esriGeometryPoint',
                inSR: 102100,
                spatialRel: 'esriSpatialRelIntersects',
                outFields: "*",
                returnGeometry: false,
                f: 'json'
            };

            return new Promise((resolve, reject)=>{

                esriRequest(metadataLayerUrl + '/query', {
                    method: 'get',
                    query: queryParam,
                    responseType: "json"
                }).then(function(response){
                    // callback(response.data);
                    // console.log(response);
                    const feature = response.data && response.data.features && response.data.features.length ? response.data.features[0] : null;
                    const date = feature.attributes[FIELD_NAME_SRC_DATE];
                    const dateFormatted = helper.formatDate(date);
                    const provider = feature.attributes[FIELD_NAME_SRC_PROVIDER];
                    const source = feature.attributes[FIELD_NAME_SRC_NAME];
                    const resolution = feature.attributes[FIELD_NAME_SRC_RES];
                    const accuracy = feature.attributes[FIELD_NAME_SRC_ACC];
                    const outputData = feature ? { date, dateFormatted, provider, source, resolution, accuracy } : null;
                    resolve(outputData);
                });
            });

        };

        const getMetadataMapServiceUrl = (releaseNum)=>{
            const mapServiceUrl = waybackAgolItemIds[releaseNum] && waybackAgolItemIds[releaseNum].metadataLayerUrl ? waybackAgolItemIds[releaseNum].metadataLayerUrl : null;
            return mapServiceUrl;
        };

        const getMetadataItemID = (releaseNum)=>{
            const itemID = waybackAgolItemIds[releaseNum] && waybackAgolItemIds[releaseNum].metadataLayerItemID ? waybackAgolItemIds[releaseNum].metadataLayerItemID : null;
            return itemID;
        };

        const getMetaDataLayerId = (zoom)=>{
            zoom = +zoom;
            const layerID = MAX_ZOOM - zoom;
            const layerIdForMinZoom = MAX_ZOOM - MIN_ZOOM; // the service has 14 sub layers that provide metadata up to zoom level 10 (layer ID 14), if the zoom level is small that (e.g. 5), there are no metadata
            // console.log('zoom', zoom);
            return layerID <= layerIdForMinZoom ? layerID : layerIdForMinZoom;
        };

        // url to the map service for that release 
        const getMetaDataLayerUrl = (releaseNum, zoom)=>{

            const metadataServiceUrl = getMetadataMapServiceUrl(releaseNum);
            const layerID = getMetaDataLayerId(zoom);

            // console.log(layerID);

            if(!metadataServiceUrl){
                // console.error('no Metadata Layer found for release >', releaseNum);
                return;
            }

            return metadataServiceUrl + '/' + layerID;

        };

        // const getSubLayersInfo = ()=>{
        //     // return 
        // };

        return {
            getData,
            getMetadataMapServiceUrl,
            getMetadataItemID
        };

    };

    const OAuthManager = function(){
        
        const oauth_appid = window.location.hostname === 'localhost' ? OAUTH_APPID_DEV : OAUTH_APPID_PROD; 

        const info = new OAuthInfo({
            appId: oauth_appid,
            popup: false,
        });

        let userCredential = null;
        let isAnonymous = true;
        let poralUser = null;

        const init = ()=>{
            esriId.useSignInPage = false;
            esriId.registerOAuthInfos([info]);

            esriId.checkSignInStatus(info.portalUrl + "/sharing").then((res)=>{
                setUserCredential(res);
                setPortalUser();
            }).catch(()=>{
                // Anonymous view
                // console.log('Anonymous view');
            });
        };

        const signIn = ()=>{
            esriId.getCredential(info.portalUrl + "/sharing").then((res)=>{
                setUserCredential(res);
            });
        };

        const signOut = ()=>{
            esriId.destroyCredentials();
            window.location.reload();
        };

        const setUserCredential = (credentialObject)=>{
            userCredential = credentialObject;
            isAnonymous = credentialObject ? false : true;
        };

        const getUserContentUrl = ()=>{
            //https://www.arcgis.com/sharing/rest/content/users/vannizhang@gmail.com/addItem
            const outputUrl =  `${userCredential.server}/sharing/rest/content/users/${userCredential.userId}`;
            return outputUrl
        };

        const setPortalUser = ()=>{

            const portal = new Portal();

            // Setting authMode to immediate signs the user in once loaded
            portal.authMode = "immediate";

            // Once loaded, user is signed in
            portal.load().then(()=>{
                console.log(portal);
                console.log(portal.user);
                poralUser = portal.user;
            });
        };

        const getCustomBaseURL = ()=>{
            return poralUser && poralUser.portal && poralUser.portal.urlKey ? `https://${poralUser.portal.urlKey}.maps.arcgis.com` : null;
        };

        const checkIsAnonymous = ()=>{
            return isAnonymous;
        };

        init();

        return {
            signIn: signIn,
            signOut: signOut,
            getUserContentUrl: getUserContentUrl,
            checkIsAnonymous: checkIsAnonymous,
            getCustomBaseURL: getCustomBaseURL
        };

    };

    const AppStateManager = function(){

        const KEY_LOCALSTORAGE_APP_STATES = 'appStates';

        let mapExt = null;
        let selectedItems = [];
        let rNumForActiveLayer = null;
        let isOnlyShowingHighlighedItems = false;
        let shouldRestoreAppView = false;

        const init = ()=>{

            let appStates = localStorage.getItem(KEY_LOCALSTORAGE_APP_STATES);
            appStates = appStates ? JSON.parse(appStates) : null;

            if(appStates){
                console.log('appStates is found', appStates);

                if(appStates.mapExt){
                    mapExt = appStates.mapExt;
                }

                if(appStates.selectedItems){
                    selectedItems = appStates.selectedItems;
                }

                if(appStates.rNumForActiveLayer){
                    rNumForActiveLayer = appStates.rNumForActiveLayer;
                }

                if(appStates.isOnlyShowingHighlighedItems){
                    isOnlyShowingHighlighedItems = appStates.isOnlyShowingHighlighedItems;
                }

                localStorage.removeItem(KEY_LOCALSTORAGE_APP_STATES);

                shouldRestoreAppView = true;

            } else {
                console.log('previously stored app states not found');
            }
        };

        const getMapExt = ()=>{
            const outputMapExt = mapExt ? JSON.parse(JSON.stringify(mapExt)) : null;
            return outputMapExt;
        };

        const getSelectedItems = ()=>{
            const outputReleases = selectedItems ? JSON.parse(JSON.stringify(selectedItems)) : null;
            return outputReleases;
        };

        const reset = ()=>{
            shouldRestoreAppView = false;
            selectedItems.length = 0;
            rNumForActiveLayer = null;
            mapExt = null;
            isOnlyShowingHighlighedItems = false;
        };

        const saveAppStates = ()=>{

            const appStates = {
                mapExt: app.getMapViewExtent(),
                selectedItems: app.dataModel.getSelectedItems(true),
                rNumForActiveLayer: app.getReleaseNumFromWaybackImageryLayer(),
                isOnlyShowingHighlighedItems: appView.viewModel.isOnlyShowingHighlighedItems
            };

            localStorage.setItem(KEY_LOCALSTORAGE_APP_STATES, JSON.stringify(appStates));
        };

        const restoreAppView = ()=>{
            console.log('calling restoreAppView');

            const prevSelectedItem = getSelectedItems();
            if(prevSelectedItem.length){
                prevSelectedItem.forEach(rNum=>{
                    appView.viewModel.setSelectedItem(rNum, true);
                });
            }

            if(rNumForActiveLayer){
                appView.viewModel.setActiveItem(rNumForActiveLayer);
            }

            if(isOnlyShowingHighlighedItems){
                appView.viewModel.toggleHighlightedItems();
            }

            appView.uploadWebMapModal.show();

            reset();
        };

        const checkShouldRestore = ()=>{
            return shouldRestoreAppView;
        };

        init();

        return {
            getMapExt: getMapExt,
            save: saveAppStates,
            restore: restoreAppView,
            shouldRestore: checkShouldRestore
        };
    };

    const WaybackImageryLayer = BaseTileLayer.createSubclass({

        properties: {
            urlTemplate: null,
            m: null, // m encodes the release number,
            isLayerReady: false
        },

        getTileUrl: function(level, row, col) {
            const m = this.m;
            // console.log('WaybackImageryLayer getTileUrk', level, row, col);
            return this.urlTemplate.replace("{m}", m).replace("{l}", level).replace("{r}", row).replace("{c}", col);
        },

    });

    // 
    const SelectedTileElement = function(options){

        let delayForToggleVisibility = null;

        this.topLeftScreenPoint = options.topLeftScreenPoint || null;
        this.imageUrlByReleaseNumber = {};

        this.addImageUrlByReleaseNumber = (rNum, imageUrl)=>{
            this.imageUrlByReleaseNumber[+rNum] = imageUrl;
        };

        this.getAltImageUrl = (rNum)=>{
            let altURL = null;
            const urlTemplate = this.imageUrlByReleaseNumber[Object.keys(this.imageUrlByReleaseNumber)[0]];
            
            if(urlTemplate){
                const urlParts = urlTemplate.split('://');
                const subParts = urlParts[1].split('/');
    
                subParts[subParts.length - 4] = rNum; // replace the release number 
                const newSubPartsStr = subParts.join('/');
                altURL = urlParts[0] + '://' + newSubPartsStr;
            }

            return altURL;
        }

        this.getImageUrlByReleaseNumber = (rNum)=>{
            let imgUrl = this.imageUrlByReleaseNumber[+rNum];

            if(!imgUrl){
                const altRNum = app.dataModel.getAltReleaseNum(+rNum);
                imgUrl = this.imageUrlByReleaseNumber[altRNum] || this.getAltImageUrl(rNum);
            }

            return imgUrl;
        };

        this.showPreview = (rNum)=>{
            clearTimeout(delayForToggleVisibility);

            const imageUrl = this.getImageUrlByReleaseNumber(rNum);
            const topLeftPos = this.topLeftScreenPoint;
            const releaseDate = app.dataModel.getReleaseDate(rNum);

            if(topLeftPos && imageUrl){
                delayForToggleVisibility = setTimeout(()=>{
                    // app.getMetaData({
                    //     releaseNum: rNum
                    // }).then(metadata=>{
                    //     console.log('metadata for preview window', metadata);
                    //     const imageAcquiredDate = metadata.date;
                    //     appView.tilePreviewWindow.show(topLeftPos, imageUrl, releaseDate, imageAcquiredDate);
                    // }).catch(error=>{
                    //     appView.tilePreviewWindow.show(topLeftPos, imageUrl, releaseDate);
                    // })
                    appView.tilePreviewWindow.show(topLeftPos, imageUrl, releaseDate);
                }, 50);
            }
        };

        this.hidePreview = ()=>{
            clearTimeout(delayForToggleVisibility);

            delayForToggleVisibility = setTimeout(()=>{
                appView.tilePreviewWindow.hide();
            }, 200);
        };
    };

    const AppDataModel = function(){

        this.releases = []; // array of all release numbers since 2014
        this.releasesDict = null; // lookup table with release number as key, will need to use it to get the index of the element 
        this.isReady = false;

        this.init = (releasesData)=>{
            if(!releasesData || !releasesData.length){
                console.error('list of releases from the select.json file is required to init AppDataModel');
                return;
            }

            this.initReleasesArr(releasesData);
            this.isReady = true;
        };

        this.initReleasesArr = (data=[])=>{
            const dict = {};

            this.releases = data.map((d, index) => {

                const rNum = +d[KEY_RELEASE_NUM];
                const rName = d[KEY_RELEASE_NAME];
                const agolItemID = waybackAgolItemIds[rNum] ? waybackAgolItemIds[rNum].itemID : null;
                const rDate = helper.extractDateFromStr(rName);
                const rDatetime = helper.convertToDate(rDate);
                const agolItemURL = helper.getAgolUrlByItemID(agolItemID); // ArcGIS Online item url
                const layerURL = waybackAgolItemIds[rNum] ? waybackAgolItemIds[rNum].itemURL :null; // the actual layer url that will needs to be used when create webmap

                d.index = index;
                d.release = rNum;
                d.releaseName = rName;
                d.releaseDate = rDate;
                d.releaseDatetime = rDatetime;
                d.isActive = false;
                d.isSelected = false;
                d.isHighlighted = false;
                d.agolItemID = agolItemID;
                d.agolItemURL = agolItemURL;
                d.layerURL = layerURL;

                dict[rNum] = d;

                return d;
            });

            this.initReleasesDict(dict);

            // console.log(this.releases);
        };

        this.initReleasesDict = (dict={})=>{
            this.releasesDict = dict; 
        };

        this.getSelectedItems = (shouldOnlyReturnReleaseNum)=>{
            let selectedItems = this.releases.filter(d=>{
                return d.isSelected;
            });

            if(shouldOnlyReturnReleaseNum){
                selectedItems = selectedItems.map(d=>{
                    return d.release
                });
            }

            return selectedItems;
        };

        this.getFullListOfReleases = (highlightedItems=[], rNumForActiveItem)=>{
            let outputList = this.releases;

            outputList = outputList.map(d=>{
                const isHighlighted = highlightedItems.includes(d.release);
                d.isHighlighted = isHighlighted;
                d.isActive = d.release === rNumForActiveItem ? true : false;
                return d;
            });

            return outputList;
        };

        this.getReleaseName = (rNum)=>{
            return this.releasesDict[rNum][KEY_RELEASE_NAME];
        };

        // find the release num of the one that is before the given release but with updated tiles
        this.getAltReleaseNum = (rNum)=>{
            const idxOfGivenRNum = this.releasesDict[rNum].index
            const altReleases = this.releases
                                        .slice(idxOfGivenRNum + 1)
                                        .filter(d=>{
                                            return d.isHighlighted;
                                        });

            return altReleases[0] ? altReleases[0].release : null;
        };

        this.getReleaseDate = (rNum, isOutputInDateTimeFormat)=>{
            return isOutputInDateTimeFormat ? this.releasesDict[rNum].releaseDatetime : this.releasesDict[rNum].releaseDate;
        };

        this.getItemAgolUrl = (rNum)=>{
            return this.releasesDict[rNum].agolItemURL;
        };

        this.getIsSelected = (rNum)=>{
            return this.releasesDict[rNum].isSelected; 
        };

        this.getMostRecentReleaseNum = ()=>{
            return this.releases[0][KEY_RELEASE_NUM];
        };

        this.getFirstAndLastReleaseDates = ()=>{
            const oldestReleaseDate = this.releases[this.releases.length - 1].releaseDatetime;
            const latestReleaseDate = this.releases[0].releaseDatetime;
            return [oldestReleaseDate, latestReleaseDate];
        };

        // get the release number of the item before the given item... e.g. input=>Release Number for 2018 Release 10; output=>Release Number for 2018 Release 9
        this.getReleaseNumOneBefore = (releaseNum)=>{
            const prevReleaseIndex = this.releasesDict[+releaseNum].index + 1;
            return this.releases[prevReleaseIndex] ? this.releases[prevReleaseIndex][KEY_RELEASE_NUM] : null;
        };

        // get release numbers for all releases that have updated data for the give level, row, column
        this.getReleaseNumbersByLRC = (level, row, column)=>{

            return new Promise((resolve, reject) => {

                const mostRecentRelease = this.getMostRecentReleaseNum();

                const results = [];
    
                const tileRequest = (rNum)=>{
    
                    const requestUrl =  URL_WAYBACK_IMAGERY_TILEMAP.replace("{m}", rNum).replace("{l}", level).replace("{r}", row).replace("{c}", column);
    
                    $.ajax({
                        type: "GET",
                        url: requestUrl,
                        success: (res)=>{
    
                            // this release number indicates the last release with updated data for the selected area (defined by l, r, c),
                            // we will save it to the finalResults so it can be added to the timeline
                            const lastRelease = res.select && res.select[0] ? res.select[0] : rNum; 
    
                            if(res.data[0]){
                                results.push(+lastRelease);
                            }

                            const nextReleaseToCheck = res.data[0] ? this.getReleaseNumOneBefore(lastRelease) : null; 

                            if(nextReleaseToCheck){
                                tileRequest(nextReleaseToCheck);
                            } else {
                                resolve(results);
                            }
                        },
                        error: function (request, textStatus, errorThrown) {
                            // console.log(request.getAllResponseHeaders());
                        }
                    });
    
                };
    
                tileRequest(mostRecentRelease);
            });

        };
        
    };

    const AppView = function(){

        // cache dom elements
        const $body = $('body');
        const $initallyHideItems = $('.initally-hide');
        const $sidebarLoader = $('.sidebar-loader');
        const $mapLoader = $('.map-loader');
        const $createWebmapBtn = $('.create-agol-webmap');
        const $countOfSelectedItems = $('.val-holder-count-of-selected-items');
        const $activeItemTitle = $('.val-holder-active-item-title');
        const $waybackLayerLoadingFailedAlert = $('.wayback-layer-loading-failed-alert');
        const $cboxToggleHighlightedItems = $('.cbox-toggle-highlighted-items');
        const $referenceLayerToggleBtn = $('.reference-layer-toggle-btn');

        // app view properties
        let isInitallyHideItemsVisible = false;
        let waybakLayerLoadingFailedMsgHideDelay = null;

        // app view core components
        this.viewModel =  null; // view model that stores wayback search results data and its states (isActive, isSelected) that we use to populate data viz containers 
        this.itemList = null;
        this.barChart = null;
        this.tilePreviewWindow = null;
        this.tooltip = null;
        this.uploadWebMapModal = null;
        this.popupInfoWindow = null;

        this.init = ()=>{
            this.viewModel = new ViewModel(this);
            this.barChart = new BarChart(DOM_ID_BARCHART);
            this.itemList = new ItemList(DOM_ID_ITEMLIST);
            this.tilePreviewWindow = new TilePreviewWindow();
            this.tooltip = new CustomizedTooltip();
            this.uploadWebMapModal = new UploadWebMapModal(MODAL_ID_UPLAOD_WEBMAP);
            this.popupInfoWindow = new PopupInfoWindow({
                addToWebMapBtnOnClick: (data)=>{
                    // console.log('.js-add-to-webmap clicked', data)
                    appView.viewModel.setSelectedItem(data.releaseNum, data.isSelected);
                }
            });

            // init observers after all components are ready
            this.viewModel.initObservers(); 
            this.initEventHandlers();
        };

        this.updateViewModel = (results=[], viewOnUpdateEndHandler)=>{
            this.housekeeping();
            this.viewModel.setData(results);
            this.toggleMapLoader(false);

            if(viewOnUpdateEndHandler){
                viewOnUpdateEndHandler();
            }
        };

        this.toggleWaybakLayerLoadingFailedMsg = (isVisible)=>{

            if(isVisible){

                clearTimeout(waybakLayerLoadingFailedMsgHideDelay);
                
                this.toggleMapLoader(false);

                $waybackLayerLoadingFailedAlert.toggleClass('is-active', true);

                waybakLayerLoadingFailedMsgHideDelay = setTimeout(()=>{
                    $waybackLayerLoadingFailedAlert.toggleClass('is-active', false);
                }, 5000);

            } else {
                $waybackLayerLoadingFailedAlert.toggleClass('is-active', false);
            }

        };

        this.housekeeping = ()=>{
            // the contains for charts/list are hidden initally, so we need to turn them on and hide the sidebar loader
            if(!isInitallyHideItemsVisible){
                this.initActiveItemTitle();
                $sidebarLoader.toggleClass('is-active');
                $initallyHideItems.toggleClass('initally-hide', false);
                isInitallyHideItemsVisible = true;
            }
        };

        this.initActiveItemTitle = ()=>{
            const rNum = app.dataModel.getMostRecentReleaseNum();
            this.setActiveItemTitleTxt(rNum);
        };

        this.setActiveItemTitleTxt = (rNum, isShowingAlternative)=>{

            rNum = rNum || $activeItemTitle.attr('data-active-item-release-num');

            const rDate = app.dataModel.getReleaseDate(rNum);
            const titleTxt = 'Wayback ' + rDate;
            $activeItemTitle.text(titleTxt);

            if(!isShowingAlternative){
                $activeItemTitle.attr('data-active-item-release-num', rNum);
            }
        };

        this.showTilePreviewWindow = (rNum)=>{
            if(app.selectedTile && app.isMapViewStationary){
                app.selectedTile.showPreview(rNum);
                this.popupInfoWindow.hide();
            }
        };

        this.hideTilePreviewWindow = ()=>{
            if(app.selectedTile){
                app.selectedTile.hidePreview();
            }
        };

        this.toggleMapLoader = (isLoading)=>{
            $mapLoader.toggleClass('is-active', isLoading);

            if(isLoading){
                this.toggleWaybakLayerLoadingFailedMsg(false);
            }
        };

        this.toggleCreateWebmapBtnStatus = ()=>{
            const selectedItems = app.dataModel.getSelectedItems();
            const isActive = selectedItems.length ? true: false;
            const btnWrap = $createWebmapBtn.parent();
            $createWebmapBtn.toggleClass('is-active', isActive);
            btnWrap.toggleClass('is-active', isActive);
            $countOfSelectedItems.text(selectedItems.length);
        };

        this.toggleHighlightedItemsBtnStyle = ()=>{
            $cboxToggleHighlightedItems.toggleClass('is-checked');
        };

        this.toggleReferecnceOverlayBtnStyle = ()=>{
            $referenceLayerToggleBtn.toggleClass('is-checked');
        };

        // this.populateMetadata = (data)=>{
        //     let metadataInfoHtml = '';
        //     const dateFormat = d3.timeFormat("%Y-%m-%d");

        //     if(data && data.date && data.provider){
        //         metadataInfoHtml = `
        //             <div class='trailer-1'>
        //                 <span class='trailer-0 margin-right-half'>Imagery was acquired on <b>${dateFormat(new Date(data.date))}<b></span>
        //             </div>
        //         `;
        //     }
        //     $metadataInfo.html(metadataInfoHtml);
        // };

        this.initEventHandlers = ()=>{

            $body.on('click', '.js-set-active-item', function(evt){
                const target = $(this);
                const rNum = target.attr('data-release-number');
                appView.viewModel.setActiveItem(rNum);
            });

            $body.on('click', '.js-set-selected-item', function(evt){
                const target = $(this);
                const listItem = target.parent();
                const rNum = listItem.attr('data-release-number');
                const isSelected = !listItem.hasClass('is-selected');
                appView.viewModel.setSelectedItem(rNum, isSelected);

                evt.stopPropagation();
            });

            $body.on('click', '.js-open-item-link', function(evt){
                const link = $(this).attr('data-href');
                evt.stopPropagation();
                window.open(link, '_blank');
            });

            $body.on('click', '.js-toggle-highlighted-items', function(evt){
                // const target = $(this);
                // target.toggleClass('is-checked');
                appView.viewModel.toggleHighlightedItems();
            });

            $body.on('click', '.js-open-save-web-map-modal.is-active', function(evt){

                if(app.oauthManager.checkIsAnonymous()){
                    // save current App/UI states so we can restore the app after direct back to the sign in page
                    app.stateManager.save();
                    app.oauthManager.signIn();
                } else {
                    appView.uploadWebMapModal.show();
                }

            });

            $body.on('click', '.js-save-web-map', function(evt){

                const webMapData = {
                    title: appView.uploadWebMapModal.titleStr,
                    tags: appView.uploadWebMapModal.tagsStr,
                    snippet: appView.uploadWebMapModal.snippetStr,
                    desc: appView.uploadWebMapModal.descStr,
                };

                appView.uploadWebMapModal.toggleIsWebMapOnUploading(true);

                app.saveAsWebMap(webMapData, res=>{
                    // console.log(res);
                    if(res.success){
                        const webmapId = res.id
                        const webMapUrl = helper.getAgolWebMapUrlByItemID(webmapId);
                        appView.uploadWebMapModal.setWebMapUrl(webMapUrl);
                    }
                });
            });

            $body.on('click', '.js-open-wayback-webmap', function(evt){
                appView.uploadWebMapModal.openWebmapLink();
            });

            $body.on('mouseenter', '.js-show-selected-tile-on-map', function(evt){
                const target = $(this);
                const rNum = target.attr('data-release-number');
                appView.showTilePreviewWindow(rNum);
            });

            $body.on('mouseleave', '.js-show-selected-tile-on-map', function(evt){
                appView.hideTilePreviewWindow();
            });

            $body.on('mouseenter', '.js-show-customized-tooltip', function(evt){
                const target = $(this);
                // const tooltipContent = target.hasClass('is-active') || target.hasClass('is-selected') ? target.attr('data-tooltip-content-alt') : target.attr('data-tooltip-content');
                const tooltipContent = target.parent().hasClass('is-selected') ? target.attr('data-tooltip-content-alt') : target.attr('data-tooltip-content');
                appView.tooltip.show(tooltipContent, target);
            });

            $body.on('mouseleave', '.js-show-customized-tooltip ', function(evt){
                appView.tooltip.hide();
            });

            $body.on('click', '.js-clear-all-selected-items', function(evt){
                appView.viewModel.setSelectedItem(null);
            });

            $body.on('click', '.js-toggle-reference-layer', (evt)=>{
                appView.toggleReferecnceOverlayBtnStyle();
                app.toggleReferenceOverlay();
            });

        };

        // this.init();
    };

    const ViewModel = function(appView){

        this.data = [];
        this.isOnlyShowingHighlighedItems = false; // if true, only show releases that come with changes cover current map area, otherwise show all releases

        // state observers
        this.observerForViewData = null; 
        this.observerForActiveItem = null; 
        this.observerForSelectedItem = null; 
        this.observerForToggleHighlightedItem = null; 

        this.setData = (data)=>{
            this.data = data;

            if(this.isOnlyShowingHighlighedItems){
                this.filterData();
            } else {
                this.observerForViewData.notify(data);
            }
        };

        this.filterData = ()=>{
            let data = this.data;
            
            if(this.isOnlyShowingHighlighedItems){
                data = data.filter(d=>{
                    return d.isHighlighted === true;
                });
            }

            this.observerForViewData.notify(data);
        };

        // active item is the one visible on map
        this.setActiveItem = (rNum)=>{
            this.observerForActiveItem.notify(rNum);
            this.data.forEach(d=>{
                const isActive = (+d.release === +rNum) ? true : false;
                d.isActive = isActive;
            });
        };

        // selected item is the one with checkbox checked
        this.setSelectedItem = (rNum, isSelected)=>{

            if(rNum){
                this.data.forEach(d=>{
                    if(+d.release === +rNum){
                        d.isSelected = isSelected;
                    }
                });
            } else {
                // set isSelectd flag for all items as false
                this.data.forEach(d=>{
                    d.isSelected = false;
                });
            }


            this.observerForSelectedItem.notify({
                release: rNum,
                isSelected: isSelected
            });
        };

        this.toggleHighlightedItems = ()=>{
            this.isOnlyShowingHighlighedItems = !this.isOnlyShowingHighlighedItems;
            // this.filterData();
            this.observerForToggleHighlightedItem.notify();
        };

        this.getData = ()=>{
            return this.data;
        };

        // compare the array of release numbers to highlighted items (releases with changes) from viewModel, return false if two arrays are same so it won't update the viewModel 
        this.compareReleasesWithChanges = (releases)=>{
            const highlightedItems = this.data.reduce((accu, curr)=>{
                if(curr.isHighlighted){
                    accu.push(curr.release);
                }
                return accu;
            }, []);

            return helper.arraysEqual(highlightedItems, releases);
        };

        this.initObservers = ()=>{
            // watch the change of view data model (wayback imagery search results) to make sure the results are populated to each viz container
            this.observerForViewData = new Observable();
            this.observerForViewData.subscribe(appView.barChart.populate);
            this.observerForViewData.subscribe(appView.itemList.populate);

            // watch the selected wayback result to make sure the item for selected release gets highlighted in each viz container, also add the wayback layer for selected release to map
            this.observerForActiveItem = new Observable();
            this.observerForActiveItem.subscribe(app.addWaybackImageryLayer);
            this.observerForActiveItem.subscribe(appView.barChart.setActiveItem);
            this.observerForActiveItem.subscribe(appView.itemList.setActiveItem);
            this.observerForActiveItem.subscribe(appView.setActiveItemTitleTxt);
            this.observerForActiveItem.subscribe(app.hidePopupWindow);

            this.observerForSelectedItem = new Observable();
            this.observerForSelectedItem.subscribe(appView.itemList.toggleSelectedItem);
            this.observerForSelectedItem.subscribe(appView.toggleCreateWebmapBtnStatus);
            this.observerForSelectedItem.subscribe(appView.uploadWebMapModal.resetIsWebMapReady); // reset isWebMapReady flag to false so it would create a new web map when user make new selections
            this.observerForSelectedItem.subscribe(appView.popupInfoWindow.toggleAddToWebMapBtnStatus);
            
            this.observerForToggleHighlightedItem = new Observable();
            this.observerForToggleHighlightedItem.subscribe(this.filterData);
            this.observerForToggleHighlightedItem.subscribe(appView.toggleHighlightedItemsBtnStyle);
        };
    };

    const ItemList = function(constainerID){

        const $container = $('#' + constainerID);

        this.setActiveItem= (rNum)=>{
            const targetItem = $(`.list-card[data-release-number="${rNum}"]`);
            targetItem.addClass('is-active');
            targetItem.siblings().removeClass('is-active');
        };

        this.toggleSelectedItem= (options)=>{
            const rNum = options.release;
            const isSelected = options.isSelected;
            
            if(rNum){
                const targetItem = $(`.list-card[data-release-number="${rNum}"]`);
                targetItem.toggleClass('is-selected', isSelected);
            } else {
                // set all list card as unselected
                $(`.list-card`).toggleClass('is-selected', false);
            }
        };

        this.populate = (data)=>{

            const itemsHtmlStr = data.map((d)=>{

                const rNum = d.release;
                const rDate = d.releaseDate;
                const classesForActiveItem = d.isActive ? 'is-active' : '';
                const classesForHighlightedItem = d.isHighlighted ? 'is-highlighted' : ''
                const isSelected = d.isSelected ? 'is-selected': '';
                const linkColor = 'link-light-gray';
                const agolItemURL = d.agolItemURL;

                const htmlStr = `
                    <div class='list-card trailer-half ${classesForActiveItem} ${classesForHighlightedItem} ${isSelected} js-show-selected-tile-on-map js-set-active-item' data-release-number='${rNum}'>
                        <a href='javascript:void();' class='margin-left-half ${linkColor}'>${rDate}</a>
                        <div class='js-set-selected-item js-show-customized-tooltip add-to-webmap-btn inline-block cursor-pointer right' data-release-number='${rNum}' data-tooltip-content='Add this release to an ArcGIS Online Map' data-tooltip-content-alt='Remove this release from your ArcGIS Online Map'></div>
                        <div class='js-open-item-link open-item-btn js-show-customized-tooltip icon-ui-link-external margin-right-half inline-block cursor-pointer right ${linkColor}' data-href='${agolItemURL}' data-tooltip-content='Learn more about this release...'></div>
                    </div>
                `;

                return htmlStr;
            }).join('');

            $container.html(itemsHtmlStr);
            
        };

    };

    const BarChart = function(containerID){

        // const self = this;
        const container = d3.select("#"+containerID);
    
        const svg = container.append("svg").style("width", "100%").style("height", "100%");
        const margin = {top: 10, right: 15, bottom: 20, left: 15};
        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let width = 0;
        let height = 0;
        let xScale = null; // = d3.scaleTime().range([0, width]).domain([new Date(2014, 0, 1), new Date(2018, 10, 1)]).nice();
        let bars = null;
        let barWidth = 0;
        
        this.isReady = false;

        this.init = (data)=>{

            const containerRect = container.node().getBoundingClientRect();

            if(containerRect.width <= 0 || containerRect.height <= 0){
                return;
            }

            width = containerRect.width - margin.left - margin.right;
            height = containerRect.height - margin.top - margin.bottom;
            barWidth = width/data.length;

            this.setXScale();
            this.createAxis();

            this.isReady = true;
        };

        this.setXScale = ()=>{
            const releaseDatesDomian = app.dataModel.getFirstAndLastReleaseDates();
            xScale = d3.scaleTime()
                .range([0, width])
                .domain(releaseDatesDomian).nice();
        };

        this.createAxis = ()=>{
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale).ticks(5));
        };

        this.populate = (data)=>{

            if(!this.isReady){
                this.init(data);
            } 

            if(this.isReady){
                bars = g.selectAll(".bar")
                .remove()
                .exit()
                .data(data)		
                .enter().append("rect")
                .attr('class', function(d){
                    let classes = ['bar'];

                    if(d.isHighlighted){
                        classes.push('is-highlighted');
                    }

                    if(d.isActive){
                        classes.push('is-active');
                    } 
                    
                    return classes.join(' ');
                })
                .attr("x", function(d) { 
                    return xScale(d.releaseDatetime); 
                })
                .attr("y", 0)
                .attr("width", function(d, i){
                    return d.isHighlighted ? 4 : barWidth;
                })
                .attr("height", height)
                .on("click", function(d){
                    appView.viewModel.setActiveItem(d.release);
                })
                .on('mouseover', function(d){
                    appView.setActiveItemTitleTxt(d.release, true);
                    appView.showTilePreviewWindow(d.release);
                })
                .on('mouseout', function(d){
                    appView.setActiveItemTitleTxt();
                    appView.hideTilePreviewWindow();
                });
            }
        };

        this.setActiveItem = (rNum)=>{
            if(bars){
                bars.classed("is-active", false);
                bars.filter(function(item){
                    return item.release === +rNum;
                }).classed("is-active", true);
            }
        };
    };

    const TilePreviewWindow = function(){

        // cache dom elements
        const $body = $('body');

        let $previewWindow = null;
        let $previewWindowImg = null; 
        let $releaseDateTxt = null; 
        let $imageAcquireDateTxt = null;

        this.init = ()=>{
            // const tilePreviewWindowHtml = `
            //     <div class="tile-preview-window hide">
            //         <img>
            //         <div class='tile-preview-title text-right'>
            //             <div class='trailer-0'><span class='margin-right-half release-date-text val-holder-release-date'></span></div>
            //             <div><span class='margin-right-half taken-on-date-text val-holder-acquire-date'></span></div>
            //         </div>
            //     </div>
            // `;
            const tilePreviewWindowHtml = `
                <div class="tile-preview-window hide">
                    <img>
                    <div class='tile-preview-title'>
                        <div class='margin-left-half trailer-0'><span class='margin-right-half release-date-text val-holder-release-date'></span></div>
                    </div>
                </div>
            `;

            $previewWindow = $(tilePreviewWindowHtml);
            $body.append($previewWindow);

            $previewWindowImg = $previewWindow.find('img');
            $releaseDateTxt = $previewWindow.find('.val-holder-release-date');
            $imageAcquireDateTxt = $previewWindow.find('.val-holder-acquire-date');
        };

        this.show = (topLeftPos, imageUrl, releaseDate, acquireDate)=>{

            const releaseDateTextStr = '<b>Wayback ' + releaseDate + '</b> preview';
            // const acquireDateTextStr = acquireDate ? 'Photo taken on ' + helper.formatDate(acquireDate) : '';

            $previewWindow.css('top', topLeftPos.y);
            $previewWindow.css('left', topLeftPos.x);

            $previewWindowImg.attr('src', imageUrl);

            $releaseDateTxt.html(releaseDateTextStr);
            // $imageAcquireDateTxt.text(acquireDateTextStr);

            this.toggleVisibility(true);
        };

        this.hide = ()=>{
            this.toggleVisibility(false);
        };

        this.toggleVisibility = (isVisible)=>{
            $previewWindow.toggleClass('hide', !isVisible);
        };

        this.init();
    };

    const CustomizedTooltip = function(){

        // cache dom elements
        const $body = $('body');

        let tooltip = null;
        let delay = null;

        this.init = ()=>{
            const tooltipHtml = `<div class="customized-tooltip font-size--3 hide"></div>`;
            tooltip = $(tooltipHtml);
            $body.append(tooltip);
        };

        this.show = (content, targetDom)=>{
            delay = setTimeout(()=>{
                tooltip.text(content);
                this.setTootipPos(targetDom);
                this.toggleVisibility(true);
            },200)
        };

        this.hide = ()=>{
            clearTimeout(delay);
            this.toggleVisibility(false)
        }

        this.setTootipPos = (target)=>{
            const targetOffset = target.offset();
            const targetWidth = target.width();
            const leftOffset = targetWidth < 20 ? 10 : 5;

            const tooltipPos = {
                top: targetOffset.top,
                left: targetOffset.left + targetWidth + leftOffset
            };

            tooltip.css('top', tooltipPos.top);
            tooltip.css('left', tooltipPos.left);
        };

        this.toggleVisibility = (isVisible)=>{
            tooltip.toggleClass('hide', !isVisible);
        };

        this.init();
    };

    const UploadWebMapModal = function(modalID){

        const container = $('.modal-overlay[data-modal="' + modalID + '"]');
        const $launchBtn = container.find('.launch-webmap-btn');
        const $uploadBtn = container.find('.upload-webmap-btn');
        const $uploadBtnWrap = $uploadBtn.parent();
        const $dialogWebmapNotReady = container.find('.webmap-not-ready-dialog');
        const $dialogWebmapIsReady = container.find('.webmap-is-ready-dialog');

        const $titleTextInput = $('#webmap-title-text-input');
        const $tagsTextInput = $('#webmap-tags-text-input');
        const $descTextArea= $('#webmap-desc-textarea');

        this.isWebmapReady = false;
        this.webMapUrl = 'https://arcgis.com';

        this.titleStr = 'Custom Wayback Imagery Web Map';
        this.tagsStr = 'custom';
        this.descStr = 'This custom web map was generated from Wayback layers selected in the World Imagery Wayback app. Wayback imagery is a digital archive of the World Imagery basemap, enabling users to access different versions of World Imagery captured over the years. Each Wayback layer in this web map represents World Imagery as it existed on the date specified.';

        this.init = ()=>{
            $titleTextInput.val(this.titleStr);
            $tagsTextInput.val(this.tagsStr);
            $descTextArea.val(this.descStr);

            this.initEventHandlers();
            this.toggleUploadWebMapBtn();
        };

        this.initEventHandlers = ()=>{

            const self = this;

            $titleTextInput.on('input', function(evt){
                const target = $(this);
                const newVal = target.val();
                if(!newVal){
                    self.toggleInputIsSuccess(target, false);
                } else {
                    self.toggleInputIsSuccess(target, true);
                }
                self.titleStr = newVal;
                self.toggleUploadWebMapBtn();
            });


            $tagsTextInput.on('input', function(evt){
                const target = $(this);
                const newVal = target.val();
                if(!newVal){
                    self.toggleInputIsSuccess(target, false);
                } else {
                    self.toggleInputIsSuccess(target, true);
                }
                self.tagsStr = newVal;
                self.toggleUploadWebMapBtn();
            });

            $descTextArea.on('input', function(evt){
                const target = $(this);
                const newVal = target.val();
                self.descStr = newVal;
            });

        };

        this.setWebMapUrl = (url)=>{
            this.webMapUrl = url;
            this.toggleIsWebmapReady(true);
            this.toggleIsWebMapOnUploading(false);
        };

        this.resetIsWebMapReady = ()=>{
            this.toggleIsWebmapReady(false);
        }

        this.toggleIsWebmapReady = (isReady)=>{
            this.isWebmapReady = isReady;
            this.toggleContent();
        };

        this.toggleContent = ()=>{
            $launchBtn.toggleClass('btn-disabled', !this.isWebmapReady);
            $dialogWebmapNotReady.toggleClass('hide', this.isWebmapReady);
            $dialogWebmapIsReady.toggleClass('hide', !this.isWebmapReady);
            this.toggleUploadWebMapBtn(!this.isWebmapReady);
        };

        this.openWebmapLink = ()=>{
            this.hide();
            window.open(this.webMapUrl, '_blank');
        }

        this.show = ()=>{
            this.toggleVisibility(true);
        };

        this.hide = ()=>{
            this.toggleVisibility(false);
        };

        this.toggleVisibility = (isVisible)=>{
            if(isVisible){
                calcite.bus.emit('modal:open', {id: modalID});
            } else {
                calcite.bus.emit('modal:close');
            }
        };

        this.toggleInputIsSuccess = (targetDom, isSuccess)=>{
            targetDom.toggleClass('input-success', isSuccess);
            targetDom.toggleClass('input-error', !isSuccess);
        };

        this.toggleUploadWebMapBtn = ()=>{
            const isDisabled = !this.titleStr || !this.tagsStr ? true : false;
            $uploadBtn.toggleClass('btn-disabled', isDisabled);
        };

        this.toggleIsWebMapOnUploading= (isUploading)=>{
            $uploadBtnWrap.toggleClass('is-uploading', isUploading);
            $uploadBtn.toggleClass('btn-disabled', isUploading);
        };

        this.init();
    };

    const Observable = function(){
        this.observers = [];

        this.subscribe = (f)=>{
          this.observers.push(f);
        };
      
        this.unsubscribe = (f)=>{
          this.observers = this.observers.filter(subscriber => subscriber !== f);
        }

        this.notify = (data)=>{
            this.observers.forEach(observer => observer(data));
        }
    };

    // helpers class with miscellaneous utility functions
    const Helper = function(){

        this.arraysEqual = (arr1, arr2)=>{
            if(arr1.length !== arr2.length){
                return false;
            }
            for(var i = arr1.length; i--;) {
                if(arr1[i] !== arr2[i]){
                    return false;
                }
            }
            return true;
        };

        this.getAgolUrlByItemID = (itemID, isUrlForWebMap)=>{
            const agolBaseUrl = 'https://www.arcgis.com';
            const agolItemUrl = agolBaseUrl + '/home/item.html?id=' + itemID;
            const agolWebmapUrl = agolBaseUrl + '/home/webmap/viewer.html?webmap=' + itemID;
            return isUrlForWebMap ? agolWebmapUrl : agolItemUrl;
        };

        this.getAgolWebMapUrlByItemID = (itemID)=>{
            // const customBaseUrl = app.portalUser ? app.portalUser.portal.customBaseUrl : null;
            // const urlKey = app.portalUser ? app.portalUser.portal.urlKey : null;
            // console.log( app.oauthManager.getCustomBaseURL() );

            const customBaseUrl = app.oauthManager.getCustomBaseURL();
            const agolBaseUrl = customBaseUrl ? customBaseUrl : 'https://www.arcgis.com';
            // const agolItemUrl = agolBaseUrl + '/home/item.html?id=' + itemID;
            const agolWebmapUrl = agolBaseUrl + '/home/webmap/viewer.html?webmap=' + itemID;
            // return isUrlForWebMap ? agolWebmapUrl : agolItemUrl;
            return agolWebmapUrl;
        };

        this.extractDateFromStr = (inputStr)=>{
            const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
            const results = inputStr.match(regexpYYYYMMDD);
            return results.length ? results[0] : inputStr;
        };

        // use margin month to get a date in future/past month, need this to optimize the xScale of bar chart 
        this.convertToDate = (dateInStr, marginMonth=0)=>{
            const dateParts = dateInStr.split('-');
            const year = dateParts[0];
            const mon = marginMonth ? ((dateParts[1] - 1) + marginMonth): dateParts[1] - 1;
            const day = marginMonth ? '1' : dateParts[2];
            return new Date(year, mon, day);
        };

        this.formatDate = (epochDate)=>{
            // const dateFormat = d3.timeFormat("%Y-%m-%d");
            const dateFormat = d3.timeFormat("%b %d, %Y");
            return dateFormat(new Date(epochDate))
        };

        this.getSnippetStr = (items)=>{
            let snippetStr = 'Wayback imagery from ';
            items = items.map(d=>{
                return d.releaseDate;
            });
            snippetStr += items.slice(0, items.length - 1).join(', '); // concat all items but the last one, so we will have "a, b, c"
            snippetStr += ' and ' + items[items.length - 1] // add last one to str with and in front, so we will have "a, b, c and d"
            return snippetStr;
        };

        this.long2tile = (lon, zoom)=>{
            return (Math.floor((lon+180)/360 * Math.pow(2,zoom)));
        };

        this.lat2tile = (lat, zoom)=>{
            return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
        };

        this.tile2Long = (x,z)=>{
            return (x/Math.pow(2,z)*360-180);
        };

        this.tile2lat = (y,z)=>{
            const n=Math.PI-2*Math.PI*y/Math.pow(2,z);
            return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
        };

        this.detectBrowserType = ()=>{
            // // Opera 8.0+
            // const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            
            // // Firefox 1.0+
            // const isFirefox = typeof InstallTrigger !== 'undefined';
            
            // // Safari 3.0+ "[object HTMLElementConstructor]" 
            // const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
            
            // Internet Explorer 6-11
            const isIE = /*@cc_on!@*/false || !!document.documentMode;
            
            // Edge 20+
            const isEdge = !isIE && !!window.StyleMedia;
            
            // // Chrome 1+
            // const isChrome = !!window.chrome && !!window.chrome.webstore;
            
            // // Blink engine detection
            // const isBlink = (isChrome || isOpera) && !!window.CSS;

            return {
                isIE,
                isEdge
            };
        };

    };

    const initApp = ()=>{
        // init app and core components
        app = new WaybackApp();
        appView = new AppView();
        helper = new Helper();

        app.init();
        appView.init();
    };

    initApp();

}).catch(err => {
    // handle any errors
    console.error(err);
});

calcite.init();


