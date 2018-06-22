// import dependencies and libraries
import $ from 'jquery';
import * as d3 from "d3";
import * as esriLoader from 'esri-loader';
import * as calcite from 'calcite-web';

// import style files
import './style/index.scss';

// import other files
// import selectJson from './select.json' 


// app configs 
const OAUTH_APPID = '4Op8YK3SdKZEplai';

const ID_WEBMAP =  '86aa24cfcdf443109e3b7f2139ea6188';
const ID_WAYBACK_IMAGERY_LAYER = 'waybackImaegryLayer';

// const URL_WAYBACK_IMAGERY_BASE = 'https://wayback-euc1.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const URL_WAYBACK_IMAGERY_BASE = 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const URL_WAYBACK_IMAGERY_TILES = URL_WAYBACK_IMAGERY_BASE + '/tile/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_TILEMAP = URL_WAYBACK_IMAGERY_BASE + '/tilemap/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_SELECT = URL_WAYBACK_IMAGERY_BASE + '?f=json';
const URL_FIND_ADDRESS_CANDIDATES = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

const KEY_RELEASE_NUM = 'M';
const KEY_RELEASE_NAME = 'Name';

const DOM_ID_MAP_CONTAINER = 'mapDiv';
const DOM_ID_TIMELINE = 'timelineWrap';
const DOM_ID_BARCHART_WRAP = 'barChartWrap';
const DOM_ID_BARCHART = 'barChartDiv';
const DOM_ID_ITEMLIST = 'listCardsWrap';
const DOM_ID_SEARCH_INPUT_WRAP = 'search-input-wrap';

const DELAY_TIME_FOR_MAPVIEW_STATIONARY_EVT = 250;


esriLoader.loadModules([
    'esri/views/MapView', 
    'esri/WebMap',
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/Graphic",

    "esri/layers/BaseTileLayer",
    "esri/request",
    "esri/core/watchUtils",
    "esri/geometry/geometryEngine",
    "esri/geometry/support/webMercatorUtils",
    
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/Portal",

    "esri/widgets/Search",

    "dojo/domReady!"
]).then(([
    MapView, 
    WebMap,
    Extent,
    Point,
    Graphic,

    BaseTileLayer,
    esriRequest,
    watchUtils,
    geometryEngine,
    webMercatorUtils,

    OAuthInfo, 
    esriId,
    Portal,

    Search
])=>{

    const WaybackApp = function(){

        this.dataModel = new AppDataModel();
        this.mapView = null;
        this.waybackImageryTileElements = []; // list of wayback imagery tile objects in current view 
        this.isMapViewStationary = false; 
        this.isWaybackLayerUpdateEnd = false;
        this.delayForUpdateOnEndEvt = null; // use this delay to wait one sec before calling handler functions when map view becomes stationary
        this.selectedTile = null; // tile element that is selected to search wayback imagery releases

        this.portalUser = null;

        this.init = ()=>{
            this.signIn();
            this.initMap();
            this.fetchWaybackReleasesData();
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
            });

            this.setMapView(view);
            this.setMapEventHandlers(view);
            this.initSearchWidget(view)
            // this.setBasemapViewWatcher(view);
        };

        this.initDataModel = (data)=>{
            this.dataModel.init(data);
        };

        this.initWaybackImageryLayer = ()=>{
            const mostRecentRelease = this.dataModel.getMostRecentReleaseNum();

            const waybackLayerOnReadyHandler = (isReady)=>{
                // console.log('wayback layer is initated for the very first time...', isReady);
                this.getWaybackImageryTileElement(this.mapView.center);
            };

            this.addWaybackImageryLayer(mostRecentRelease, waybackLayerOnReadyHandler);
        };

        this.initSearchWidget = (view)=>{
            const searchWidget = new Search({
                view: view,
                resultGraphicEnabled: false,
                popupEnabled: false
            });

              // Adds the search widget below other elements in
              // the top left corner of the view
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

            // console.log('selected tile', tileElement);
        };

        this.removeSelectedTile = ()=>{
            this.selectedTile = null;
        }

        this.getMapViewExtent = ()=>{
            const mapExtInGeoUnits = webMercatorUtils.webMercatorToGeographic(this.mapView.extent);
            return mapExtInGeoUnits.toJSON();
        };

        this.setPortalUser = (portalUser)=>{
            // console.log(portalUser);
            this.portalUser = portalUser;
        };

        this.toggleIsMapViewStationary = (isStationary)=>{
            this.isMapViewStationary = isStationary;
            // console.log('isMapViewStationary', this.isMapViewStationary);

            if(!isStationary){
                appView.toggleMapLoader(true);
            } else {
                this.updateEventsOnEndHandler();
            }

        };

        this.toggleIsWaybackLayerUpdateEnd = (isEnd)=>{
            this.isWaybackLayerUpdateEnd = isEnd;
            // console.log('isWaybackLayerUpdateEnd', this.isWaybackLayerUpdateEnd);

            if(!isEnd){
                appView.toggleMapLoader(true);
            } else {
                this.updateEventsOnEndHandler();
            }
        };

        this.addWaybackImageryLayer = (releaseNum, wayBackLayerOnReadyHandler)=>{

            // console.log('adding layer for release num', releaseNum);

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

            this.setWatcherForLayerUpdateEndEvt(waybackLyr, wayBackLayerOnReadyHandler);
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
                // console.log('click map', evt);
                this.getWaybackImageryTileElement(evt.mapPoint);
            });

            watchUtils.whenFalse(view, "stationary", (evt)=>{
                clearTimeout(this.delayForUpdateOnEndEvt);
                this.toggleIsMapViewStationary(false);
            });

            watchUtils.whenTrue(view, "stationary", (evt)=>{
                this.delayForUpdateOnEndEvt = setTimeout(()=>{
                    this.toggleIsMapViewStationary(true);
                }, DELAY_TIME_FOR_MAPVIEW_STATIONARY_EVT);
            });
        };

        // // imspired by this example taht watch the change of basemap tiles: https://jsbin.com/zojaxev/edit?html,output
        this.setWatcherForLayerUpdateEndEvt = (layer, wayBackLayerOnReadyHandler)=>{
            this.mapView.whenLayerView(layer)
            .then((layerView)=>{
                // console.log('layerView', layerView);

                watchUtils.whenTrue(layerView, 'updating', f => {
                    // console.log('layer view is updating');
                    this.toggleIsWaybackLayerUpdateEnd(false);
                });

                // The layerview for the layer
                watchUtils.whenFalse(layerView, 'updating', f => {
                    // console.log(layerView._tileContainer.children);
                    // console.log('layer view is updated');

                    this.setWaybackImageryTileElements(layerView._tileContainer.children);

                    if(!layer.isLayerReady){
                        layer.isLayerReady = true;

                        appView.toggleMapLoader(false);

                        if(wayBackLayerOnReadyHandler){
                            wayBackLayerOnReadyHandler(layer.isLayerReady);
                        }

                        this.isWaybackLayerUpdateEnd = true;

                        // console.log('layer view is ready');
                    } else {
                        // console.log('layer view is updated');
                        this.toggleIsWaybackLayerUpdateEnd(true);
                    }
                });
            })
            .catch((error)=>{
                // An error occurred during the layerview creation
            });
        };

        this.setWaybackImageryTileElements = (items)=>{
            // this.waybackImageryTileElements = items;

            this.waybackImageryTileElements = items.filter(d=>{

                const tileTopLeftPoint = new Point({
                    x: d.x,
                    y: d.y,
                    spatialReference: { wkid: 3857 }
                });

                const tileTopLeftPointToScreen = this.mapView.toScreen(tileTopLeftPoint);
                const tileCenetrPoint = this.mapView.toMap(tileTopLeftPointToScreen.x + 128, tileTopLeftPointToScreen.y + 128);
                const isInCurrentMapExt = geometryEngine.intersects(this.mapView.extent, tileCenetrPoint);

                d.centroid = tileCenetrPoint;
                // d.topLeftScreenPoint = tileTopLeftPointToScreen;

                return isInCurrentMapExt;
            });

            // console.log('waybackImageryTileElements', this.waybackImageryTileElements);
        };

        // we need to watch both layerView on update and mapView on update events and execute search once both of these two updates events are finished
        this.updateEventsOnEndHandler = ()=>{
            if(this.isMapViewStationary && this.isWaybackLayerUpdateEnd){
                // console.log('map is stable and wayback layer is ready, start searching releases using tile from view center');
                // console.log('map view center before calling getWaybackImageryTileElement', this.mapView.center);
                this.getWaybackImageryTileElement(this.mapView.center);
            }
        };

        this.findTileElementByPoint = (mapPoint=null)=>{

            mapPoint = mapPoint || this.mapView.center;

            let tileElement = null;
            let minDist = Number.POSITIVE_INFINITY;
            let realZoomLevel = this.waybackImageryTileElements[this.waybackImageryTileElements.length - 1].key.level;

            this.waybackImageryTileElements.forEach(d=>{
                const isZoomLevelCorrect = d.key.level === realZoomLevel ? true : false;
                const dist = mapPoint.distance(d.centroid);
                if(isZoomLevelCorrect && dist < minDist){
                    minDist = dist;
                    tileElement = d;
                }
            });

            return tileElement;
        };

        this.getWaybackImageryTileElement = (mapPoint=null)=>{

            // console.log(this.waybackImageryTileElements);

            this.removeSelectedTile();

            // let minDist = Number.POSITIVE_INFINITY;
            // let tileClicked = null;
            // let realZoomLevel = this.waybackImageryTileElements[this.waybackImageryTileElements.length - 1].key.level;

            if(this.waybackImageryTileElements.length){

                appView.toggleMapLoader(true);

                // this.waybackImageryTileElements.forEach(d=>{
                //     const isZoomLevelCorrect = d.key.level === realZoomLevel ? true : false;
                //     const dist = mapPoint.distance(d.centroid);
                //     if(isZoomLevelCorrect && dist < minDist){
                //         minDist = dist;
                //         tileClicked = d;
                //     }
                // });

                const tileClicked = this.findTileElementByPoint(mapPoint);

                this.setSelectedTile(tileClicked);
    
                // console.log(tileClicked.key.level, tileClicked.key.row, tileClicked.key.col);
                this.searchWayback(tileClicked.key.level, tileClicked.key.row, tileClicked.key.col);

                appView.crosshairMarker.setPos(this.getScreenPointFromXY(mapPoint.x, mapPoint.y));

                
            } else {
                console.log('wayback imagery is still loading');
            }

        };

        // search all releases with updated data for tile image at given level, row, col
        this.searchWayback = (level, row, column)=>{

            // console.log('start search wayback imageries for selected l,r,c');

            const onSuccessHandler = (res)=>{

                // download the tile image file using each release number in res, convert to to dataUri to so we can check if there are duplicated items
                const resolvedTileDataUriArray = res.map(rNum=>{
                    const tileURL = this.getWaybackTileURL(rNum, level, row, column);
                    return this.imageToDataUri(tileURL, rNum);
                });

                // check and remove the duplicated items once DataUri for all images are resolved
                Promise.all(resolvedTileDataUriArray).then(resolvedResults => {

                    const uniqueDataURIs = [];
                    const releasesWithChanges = [];
                    const releaseNumForActiveItem = this.getReleaseNumFromWaybackImageryLayer();

                    resolvedResults.forEach((d, i)=>{
                        if(!uniqueDataURIs.includes(d.dataUri)){
                            // const rName = this.dataModel.getReleaseName(d.release);
                            // const rDate = this.dataModel.getReleaseDate(d.release);
                            // const rDateTime = this.dataModel.getReleaseDate(d.release, true);
                            // const isActive = +releaseNumForActiveItem === +d.release ? true : false;

                            uniqueDataURIs.push(d.dataUri);

                            // resultsWithDuplicatesRemoved.push({
                            //     release: d.release,
                            //     releaseName: rName,
                            //     releaseDate: rDate,
                            //     releaseDateTime: rDateTime,
                            //     imageUrl: d.imageUrl,
                            //     isActive: isActive,
                            //     isSelected: false
                            // });
                            
                            this.selectedTile.addImageUrlByReleaseNumber(d.release, d.imageUrl);

                            releasesWithChanges.push(d.release);
                        }
                    });

                    // console.log(this.selectedTile);

                    const isViewDataSame = appView.viewModel.compareReleasesWithChanges(releasesWithChanges);

                    // console.log('isViewDataSame', isViewDataSame);

                    // console.log('map view center after wayback search results returned', this.mapView.center);

                    if(!isViewDataSame){
                        const releasesToDisplay = this.dataModel.getFullListOfReleases(releasesWithChanges, releaseNumForActiveItem);
                        appView.updateViewModel(releasesToDisplay);

                        // console.log('update view data model', '\n');
                    } else {
                        appView.toggleMapLoader(false);

                        // console.log('no need to update view data model \n');
                    }
                });

            };

            this.dataModel.getReleaseNumbersByLRC(level, row, column).then(releases=>{
                // console.log('getReleaseNumbersByLRC results', releases);
                onSuccessHandler(releases);
            });
        };


        // TODO: need to process this in back end
        this.imageToDataUri = (imageURL, rNum)=>{

            return new Promise((resolve, reject) => {

                let canvas = document.getElementById("tileImageCanvas");
                if(!canvas){
                    canvas = document.createElement('canvas');
                    canvas.setAttribute("id", "tileImageCanvas");
                }
    
                const img = new Image();
                img.crossOrigin="Anonymous";
                img.src = imageURL;
                img.onload = function () {
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, img.width, img.height);
                    const tileImageDataUri = canvas.toDataURL('image/png').substr(75,320); 

                    resolve({
                        release: rNum,
                        dataUri: tileImageDataUri,
                        imageUrl: imageURL
                    });
                };
            });

        };

        this.getWaybackTileURL = (rNum, level, row, column, isReturnTileData)=>{
            return URL_WAYBACK_IMAGERY_TILES.replace("{m}", rNum).replace("{l}", level).replace("{r}", row).replace("{c}", column);
        };

        this.saveAsWebMap = ()=>{
            const requestURL = this.portalUser.userContentUrl + '/addItem'; 
            const currentMapExtent = this.getMapViewExtent();
            const webMapTitle = `wayback-imagery-2018-06-19`;
            const webMapDesc = `wayback imagery layer is awesome!`;

            const uploadRequestContent = {
                'title': webMapTitle,
                'description': webMapDesc, 
                'tags':'wayback imagery',
                'extent': [currentMapExtent.xmin, currentMapExtent.ymin, currentMapExtent.xmax, currentMapExtent.ymax].join(','),
                'type': 'Web Map',
                'overwrite': true,
                'f': 'json'
            };

            const requestText = {  
                "operationalLayers":[

                ],
                "baseMap":{  
                    "baseMapLayers":[  
                        {  
                            "id":"defaultBasemap",
                            "layerType":"ArcGISTiledMapServiceLayer",
                            "url":"https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
                            "visibility": true,
                            "opacity": 1,
                            "title": "Topographic"
                        }
                    ],
                    "title":"Topographic"
                },
                "spatialReference":{"wkid":102100,"latestWkid":3857}
            };

            uploadRequestContent.text = JSON.stringify(requestText);

            // esriRequest(requestURL, {
            //     method: 'post',
            //     query: uploadRequestContent,
            //     responseType: "json"
            // }).then(function(response){
            //     console.log(response);
            // });

            // console.log(uploadRequestContent);

            alert('save items as a webmap...will finish this part when we have items for each release ready on AGOL');
        };

        this.getScreenPointFromXY = (x, y)=>{

            const xOffsetForMapDiv = 350; 

            const pt = new Point({
                x: x,
                y: y,
                spatialReference: { wkid: 3857 }
            });

            const screenPt = this.mapView.toScreen(pt);

            screenPt.x = screenPt.x + xOffsetForMapDiv; // need to add this offset because we have gutter and side bar at left of the page

            return screenPt;
        };

        this.signIn = ()=>{

            const info = new OAuthInfo({
                appId: OAUTH_APPID,
                popup: false
            });

            esriId.registerOAuthInfos([info]);

            const portal = new Portal();

            // Setting authMode to immediate signs the user in once loaded
            portal.authMode = "immediate";

            // Once portal is loaded, user signed in
            portal.load().then((res)=>{
                // console.log('res', res);
                this.setPortalUser(res.user);
            });
        };

        this.init();
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

        let delayFortoggleVisibility = null;

        this.topLeftScreenPoint = options.topLeftScreenPoint || null;
        this.imageUrlByReleaseNumber = {};

        this.addImageUrlByReleaseNumber = (rNum, imageUrl)=>{
            this.imageUrlByReleaseNumber[+rNum] = imageUrl;
        };

        this.getAltImageUrl = (rNum)=>{
            const urlTemplate = this.imageUrlByReleaseNumber[Object.keys(this.imageUrlByReleaseNumber)[0]];
            const urlParts = urlTemplate.split('://');
            const subParts = urlParts[1].split('/');

            subParts[subParts.length - 4] = rNum; // replace the release number 
            const newSubPartsStr = subParts.join('/');
            const altURL = urlParts[0] + '://' + newSubPartsStr;

            return altURL;
        }

        this.getImageUrlByReleaseNumber = (rNum)=>{
            let imgUrl = this.imageUrlByReleaseNumber[+rNum];
            
            if(!imgUrl){
                imgUrl = this.getAltImageUrl(rNum);
            }

            return imgUrl;
        };

        this.showPreview = (rNum)=>{
            clearTimeout(delayFortoggleVisibility);

            const imageUrl = this.getImageUrlByReleaseNumber(rNum);
            const topLeftPos = this.topLeftScreenPoint;
            const date = app.dataModel.getReleaseDate(rNum);

            if(topLeftPos && imageUrl){
                appView.tilePreviewWindow.show(topLeftPos, imageUrl, date);
            }
        };

        this.hidePreview = ()=>{
            delayFortoggleVisibility = setTimeout(()=>{
                appView.tilePreviewWindow.hide();
            }, 200);
        };
    };

    const AppDataModel = function(selectJsonResponse){

        this.releases = []; // array of all release numbers since 2014
        this.releasesDict = null; // lookup table with release number as key, will need to use it to get the index of the element 

        this.init = (releasesData)=>{
            if(!releasesData || !releasesData.length){
                console.error('list of releases from the select.json file is required to init AppDataModel');
                return;
            }

            this.initReleasesArr(releasesData);

            // console.log(this.releasesDict);
            // console.log(this.releases);
        };

        this.initReleasesArr = (data=[])=>{
            const dict = {};

            this.releases = data.map((d, index) => {
                const rNum = +d[KEY_RELEASE_NUM];
                const rDate = this.extractDateFromStr(d[KEY_RELEASE_NAME]);
                d.index = index;
                d.release = rNum;
                d.releaseName = d[KEY_RELEASE_NAME];
                d.releaseDate = rDate;
                d.releaseDatetime = this.convertToDate(rDate);
                d.isActive = false;
                d.isSelected = false;
                d.isHighlighted = false;
                dict[rNum] = d;

                return d;
            });

            this.initReleasesDict(dict);
        };

        this.initReleasesDict = (dict={})=>{
            this.releasesDict = dict; 
        };

        this.toggleSelectedItem = (options)=>{
            const rNum = options.release;
            const isSelected = options.isSelected;
            this.releasesDict[rNum].isSelected = isSelected;
        };

        this.getSelectedItems = ()=>{
            const selectedItems = this.releases.filter(d=>{
                return d.isSelected;
            });
            return selectedItems;
        };

        this.getFullListOfReleases = (highlightedItems=[], rNumForActiveItem)=>{
            let outputList = this.releases;

            if(highlightedItems.length){

                outputList = outputList.map(d=>{
                    const isHighlighted = highlightedItems.includes(d.release);
                    d.isHighlighted = isHighlighted;
                    d.isActive = d.release === rNumForActiveItem ? true : false;
                    return d;
                });
            }

            return outputList;
        };

        this.getReleaseName = (rNum)=>{
            return this.releasesDict[rNum][KEY_RELEASE_NAME];
        };

        this.getReleaseDate = (rNum, isOutputInDateTimeFormat)=>{
            return isOutputInDateTimeFormat ? this.releasesDict[rNum].releaseDatetime : this.releasesDict[rNum].releaseDate;
        };

        this.getMostRecentReleaseNum = ()=>{
            return this.releases[0][KEY_RELEASE_NUM];
        };

        this.getFirstAndLastReleaseDates = ()=>{
            const oldestReleaseDate =  this.convertToDate(this.releases[this.releases.length - 1].releaseDate);
            const latestReleaseDate = this.convertToDate(this.releases[0].releaseDate);
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
    
                    // console.log('check if there is update for selected area in release', requestUrl);
    
                    $.ajax({
                        type: "GET",
                        url: requestUrl,
                        success: (res)=>{
    
                            // console.log('tileRequest response', res);
    
                            // this release number indicates the last release with updated data for the selected area (defined by l, r, c),
                            // we will save it to the finalResults so it can be added to the timeline
                            const lastRelease = res.select && res.select[0] ? res.select[0] : rNum; 
    
                            if(res.data[0]){
                                results.push(+lastRelease);
                            }
                            
                            // we need to keep check previous releases to see if it has updated data for the selected area or not, 
                            // to do that, just start from the release before last release
                            const nextReleaseToCheck = res.data[0] ? this.getReleaseNumOneBefore(lastRelease) : null; 
    
                            // console.log('no updates found in release', +rNum);
                            // console.log('this area was updated during release:', +lastRelease, '\n\n');
    
                            // console.log(lastRelease, nextReleaseToCheck);
                            // console.log('no update in release', rNum);
                            
                            if(nextReleaseToCheck){
                                tileRequest(nextReleaseToCheck);
                            } else {
                                // console.log('list releases with updated for selected location', results);
                                
                                // if(callback){
                                //     callback(results);
                                // }

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

        // this.init(selectJsonResponse);

    };

    const AppView = function(){

        // cache dom elements
        const $body = $('body');
        const $initallyHideItems = $('.initally-hide');
        const $sidebarLoader = $('.sidebar-loader');
        // const $waybackDataLoadingIndicator = $('.wayback-data-loading-indicator');
        const $mapLoader = $('.map-loader');
        const $createWebmapBtn = $('.create-agol-webmap');
        const $countOfSelectedItems = $('.val-holder-count-of-selected-items');
        const $activeItemTitle = $('.val-holder-active-item-title');

        // app view properties
        let isInitallyHideItemsVisible = false;

        // app view core components
        this.viewModel =  null; // view model that stores wayback search results data and its states (isActive, isSelected) that we use to populate data viz containers 
        this.itemList = null;
        this.barChart = null;
        this.tilePreviewWindow = null;
        this.crosshairMarker = null;
        this.tooltip = null;
        // this.locator = null;

        this.init = ()=>{
            this.viewModel = new ViewModel(this);
            this.barChart = new BarChart(DOM_ID_BARCHART);
            this.itemList = new ItemList(DOM_ID_ITEMLIST);
            this.tilePreviewWindow = new TilePreviewWindow();
            this.crosshairMarker = new CrosshairMarker();
            this.tooltip = new CustomizedTooltip();
            // this.locator  = new AddressLocator(DOM_ID_SEARCH_INPUT_WRAP, URL_FIND_ADDRESS_CANDIDATES);

            // init observers after all components are ready
            this.viewModel.initObservers(); 

            this.initEventHandlers();
        };

        this.updateViewModel = (results=[])=>{
            this.housekeeping();
            this.viewModel.setData(results);
            this.toggleMapLoader(false);
            // this.toggleLoadingIndicator(false);
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
            const titleTxt = 'Wayback to ' + rDate;
            $activeItemTitle.text(titleTxt);

            if(!isShowingAlternative){
                $activeItemTitle.attr('data-active-item-release-num', rNum);
            }
        };

        this.showTilePreviewWindow = (rNum)=>{
            if(app.selectedTile && app.isMapViewStationary && app.isWaybackLayerUpdateEnd){
                app.selectedTile.showPreview(rNum);
            }
        };

        this.hideTilePreviewWindow = ()=>{
            if(app.selectedTile){
                app.selectedTile.hidePreview();
            }
        };

        // this.toggleLoadingIndicator = (isLoading)=>{
        //     $waybackDataLoadingIndicator.toggleClass('is-active' , isLoading);
        //     this.toggleMapLoader(isLoading);
        // };

        this.toggleMapLoader = (isLoading)=>{
            $mapLoader.toggleClass('is-active', isLoading);
        };

        this.toggleCreateWebmapBtnStatus = ()=>{
            const selectedItems = app.dataModel.getSelectedItems();
            const isActive = selectedItems.length ? true: false;
            $createWebmapBtn.toggleClass('is-active', isActive);
            $countOfSelectedItems.text(selectedItems.length);
        };

        this.initEventHandlers = ()=>{

            $body.on('click', '.js-set-active-item', function(evt){
                const target = $(this);
                const rNum = target.attr('data-release-number');
                appView.viewModel.setActiveItem(rNum);
                // console.log('display wayback imagery for release', rNum);
            });

            $body.on('click', '.js-set-selected-item', function(evt){
                const target = $(this);
                const rNum = target.attr('data-release-number');
                const isSelected = !target.hasClass('is-selected');
                appView.viewModel.setSelectedItem(rNum, isSelected);
                target.toggleClass('is-selected');
                // console.log('display wayback imagery for release', rNum);
            });

            $body.on('click', '.js-toggle-highlighted-items', function(evt){
                const target = $(this);
                target.toggleClass('is-checked');
                appView.viewModel.toggleHighlightedItems();
            });

            $body.on('click', '.js-save-web-map.is-active', function(evt){
                // alert('cannot save items to web map at this moment, still working on it');
                app.saveAsWebMap();
            });

            $body.on('mouseenter', '.js-show-selected-tile-on-map', function(evt){
                const target = $(this);
                const rNum = target.attr('data-release-number');
                appView.showTilePreviewWindow(rNum);
            });

            $body.on('mouseleave', '.js-show-selected-tile-on-map', function(evt){
                // console.log('hide tile on map');
                // appView.tilePreviewWindow.hide();
                appView.hideTilePreviewWindow();
            });

            $body.on('mouseenter', '.js-show-customized-tooltip', function(evt){
                const target = $(this);
                const tooltipContent = target.hasClass('is-active') || target.hasClass('is-selected') ? target.attr('data-tooltip-content-alt') : target.attr('data-tooltip-content');
                appView.tooltip.show(tooltipContent, target);
            });

            $body.on('mouseleave', '.js-show-customized-tooltip ', function(evt){
                appView.tooltip.toggleVisibility(false);
            });

        };

        this.init();
    };

    const ViewModel = function(appView){

        this.data = [];
        this.isOnlyShowingHighlighedItems = false; // if true, only show releases that come with changes cover current map area, otherwise show all releases

        // state observers
        this.observerForViewData = null; 
        this.observerForActiveItem = null; 
        this.observerForSelectedItem = null; 

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

            // console.log(this.data, data);
            
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

            this.data.forEach(d=>{
                if(+d.release === +rNum){
                    d.isSelected = isSelected;
                }
            });

            this.observerForSelectedItem.notify({
                release: rNum,
                isSelected: isSelected
            });

            // appView.toggleSaveAsWebmapBtn(isAnySelectedItem);
        };

        this.toggleHighlightedItems = ()=>{
            this.isOnlyShowingHighlighedItems = !this.isOnlyShowingHighlighedItems;
            this.filterData();
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

            return arraysEqual(highlightedItems, releases);
        };

        this.initObservers = ()=>{
            // watch the change of view data model (wayback imagery search results) to make sure the results are populated to each viz container
            this.observerForViewData = new Observable();
            // this.observerForViewData.subscribe(appView.timeline.populate);
            this.observerForViewData.subscribe(appView.barChart.populate);
            this.observerForViewData.subscribe(appView.itemList.populate);
            // this.observerForViewData.subscribe(appView.setNumOfReleasesTxt);

            // watch the selected wayback result to make sure the item for selected release gets highlighted in each viz container, also add the wayback layer for selected release to map
            this.observerForActiveItem = new Observable();
            this.observerForActiveItem.subscribe(app.addWaybackImageryLayer);
            // this.observerForActiveItem.subscribe(appView.timeline.setActiveItem);
            this.observerForActiveItem.subscribe(appView.barChart.setActiveItem);
            this.observerForActiveItem.subscribe(appView.itemList.setActiveItem);
            this.observerForActiveItem.subscribe(appView.setActiveItemTitleTxt);

            this.observerForSelectedItem = new Observable();
            // this.observerForSelectedItem.subscribe(appView.timeline.toggleSelectedItem);
            this.observerForSelectedItem.subscribe(app.dataModel.toggleSelectedItem);
            this.observerForSelectedItem.subscribe(appView.itemList.toggleSelectedItem);
            this.observerForSelectedItem.subscribe(appView.toggleCreateWebmapBtnStatus);
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
            
            if(!rNum){
                console.error('release number is required to toggle selected item');
                return;
            }

            const targetItem = $(`.list-card[data-release-number="${rNum}"]`);
            targetItem.toggleClass('is-selected', isSelected);
        };

        this.populate = (data)=>{

            const itemsHtmlStr = data.map((d)=>{

                const rNum = d.release;
                // const rName = d.releaseName;
                const rDate = d.releaseDate;
                const classesForActiveItem = d.isActive ? 'is-active' : '';
                const classesForHighlightedItem = d.isHighlighted ? 'is-highlighted' : ''
                const isSelected = d.isSelected ? 'is-selected': '';
                const linkColor = d.isActive || d.isHighlighted ? 'link-white' : 'link-light-gray';
                const waybackItemURL = 'https://www.arcgis.com';

                // const htmlStr = `
                //     <div class='list-card trailer-half ${classesForActiveItem} ${classesForHighlightedItem}' data-release-number='${rNum}'>
                //         <span class='js-set-active-item cursor-pointer' data-release-number='${rNum}'>${rDate}</span>
                //         <div class='inline-block right cursor-pointer set-selected-item-cbox js-set-selected-item ${isSelected}' data-release-number='${rNum}'>
                //             // <span class='icon-ui-checkbox-checked'></span>
                //             // <span class='icon-ui-checkbox-unchecked'></span>
                //         </div>
                //     </div>
                // `;

                const htmlStr = `
                    <div class='list-card trailer-half ${classesForActiveItem} ${classesForHighlightedItem} ${isSelected} js-show-selected-tile-on-map' data-release-number='${rNum}'>
                        <a href='javascript:void();' class='js-set-active-item margin-left-half ${linkColor}' data-release-number='${rNum}'>${rDate}</a>
                        <div class='js-set-selected-item js-show-customized-tooltip add-to-webmap-btn inline-block cursor-pointer right ${isSelected}' data-release-number='${rNum}' data-tooltip-content='Add this update to an ArcGIS Online Map' data-tooltip-content-alt='Remove this update from your ArcGIS Online Map'></div>
                        <a href='${waybackItemURL}' target='_blank' class='open-item-btn js-show-customized-tooltip icon-ui-link-external margin-right-half right ${linkColor}' data-tooltip-content='Learn more about this update...'></a>
                    </div>
                `;

                return htmlStr;
            }).join('');

            // const saveToWebmapBtnHtmlStr = `<div><button class="btn btn-disabled btn-fill save-web-map-btn js-save-web-map"> Save as Web Map </button></div>`;
            // const finalHtmlStr = itemsHtmlStr + saveToWebmapBtnHtmlStr;

            $container.html(itemsHtmlStr);
            
        };

    };

    const BarChart = function(containerID){

        // const self = this;
        const container = d3.select("#"+containerID);
        // const $barChartTitleTxt = $('.bar-chart-title');
    
        const svg = container.append("svg").style("width", "100%").style("height", "100%");
        const margin = {top: 10, right: 15, bottom: 30, left: 15};
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
                // console.log('constainer size is less than 0');
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
            // console.log(releaseDatesDomian);
            xScale = d3.scaleTime()
                .range([0, width])
                // .domain(releaseDatesDomian);
                .domain(releaseDatesDomian).nice();
        };

        this.createAxis = ()=>{
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale).ticks(5));

            // g.append("g")
            //   .attr("class", "axis axis--y")
            //   .call(d3.axisLeft(y).ticks(0));
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
                    // highlight the bar for the active item
                    let classes = ['bar'];

                    if(d.isHighlighted){
                        classes.push('is-highlighted');
                    }

                    if(d.isActive){
                        classes.push('is-active');
                        // self.setBarChartTitle(d.releaseName);

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
                    // console.log(d);
                    appView.viewModel.setActiveItem(d.release);
                    // self.setBarChartTitle(d.releaseName);
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

        // the chart won't be ready till the container is visible, therefore, need to call this function to populate the chart if it's not ready but the search results are there
        this.checkIfIsReady = ()=>{
            const viewModelData = appView.viewModel.getData();
            if(viewModelData.length && !this.isReady){
                this.populate(viewModelData);
            }
        };

        // this.setBarChartTitle = (titleStr)=>{
        //     $barChartTitleTxt.text(titleStr)
        // }; 

    };

    // const AddressLocator = function(containerID, searchRequestURL){
    //     // cache dom elements
    //     const $body = $('body');

    //     const self = this;
    //     const container = $('#'+containerID);
    //     const $textInput = container.find('input[type=text]');
    //     const $addressCandidatesList = container.find('.address-candidates-list');

    //     this.candidates = [];
    //     this.idxForHighlightedCandidate = -1;

    //     this.init = ()=>{
    //         initEventHandlers();
    //     };

    //     this.toggleAutoCompleteDropdownMenu = (isVisible)=>{
    //         $addressCandidatesList.toggleClass('hide', !isVisible);
    //     };

    //     const setCandidates = (data)=>{
    //         this.candidates = data.length > 5 ? data.slice(0, 5) : data;;
    //         populateCandidates(this.candidates);
    //     };

    //     const getIdxOfCandidateToHighlight = (isGettingPrev)=>{
    //         const idxOfCurrentItem = this.idxForHighlightedCandidate;
    //         let idxOfHighlightedItem = isGettingPrev ? idxOfCurrentItem - 1 : idxOfCurrentItem + 1;
    //         idxOfHighlightedItem = idxOfHighlightedItem < 0 ? this.candidates.length - 1 : idxOfHighlightedItem;
    //         idxOfHighlightedItem = idxOfHighlightedItem > this.candidates.length - 1 ? 0 : idxOfHighlightedItem;

    //         this.idxForHighlightedCandidate = idxOfHighlightedItem;

    //         return idxOfHighlightedItem;
    //     };

    //     const resetIdxForHighlightedCandidate = ()=>{
    //         this.idxForHighlightedCandidate = -1;
    //     };

    //     const getCandidates = (searchTerm)=>{
    //         esriRequest(searchRequestURL, {
    //             query: {
    //                 f: 'json',
    //                 singleLine: searchTerm,
    //             },
    //             responseType: "json"
    //         }).then(function(response){
    //             // The requested data
    //             // console.log(response);
    //             setCandidates(response.data.candidates);
    //         });
    //     };

    //     const getCandidateDataByIdx = (idx)=>{
    //         return this.candidates[idx];
    //     };

    //     const populateCandidates = (candidates=[])=>{
    //         const candidatesHtmlStr = candidates.map((d, idx)=>{
    //             const address = d.address;
    //             return `<div class='js-select-address-candidate autocomplete-menu-item' data-candidate-index=${idx}>${address}</div>`;
    //         }).join('');
    //         $addressCandidatesList.html(candidatesHtmlStr);
    //         self.toggleAutoCompleteDropdownMenu(true);
    //         resetIdxForHighlightedCandidate();
    //     };

    //     const setTextInputVal = (val='')=>{
    //         $textInput.val(val);
    //     };

    //     const setHighlightedCandidateByIdx = (idx)=>{
    //         const target = $('.autocomplete-menu-item[data-candidate-index="' + idx + '"]');
    //         target.toggleClass('is-highlighted', true);
    //         target.siblings().toggleClass('is-highlighted', false);
    //     };

    //     const candidateOnSelectHandler = (idx)=>{
    //         idx = +idx;
    //         const candidate = getCandidateDataByIdx(idx);

    //         setTextInputVal(candidate.address);
    //         self.toggleAutoCompleteDropdownMenu(false);

    //         app.setMapCenter(candidate.location.y, candidate.location.x);
    //     };

    //     const initEventHandlers = ()=>{

    //         const searchInputOnKeyUpHandler = function(evt){

    //             let currentText = $(this).val();

    //             if(evt.keyCode == 13){
    //                 searchInputOnEnterHandler();
    //             } 
    //             else if (evt.keyCode === 38 || evt.keyCode === 40){
    //                 const isGettingPrev = evt.keyCode === 38 ? true : false;
    //                 const idx = getIdxOfCandidateToHighlight(isGettingPrev);
    //                 setHighlightedCandidateByIdx(idx);
    //             }
    //             else {
    //                 if(currentText.length > 3){
    //                     // console.log('find address candidate', currentText);
    //                     getCandidates(currentText);
    //                 } else {
    //                     // console.log('close autodropdown menu');
    //                     self.toggleAutoCompleteDropdownMenu(false);
    //                 }
    //             }
    //         };

    //         const searchInputOnEnterHandler = function(evt){
    //             const candidateIdx = self.idxForHighlightedCandidate !== -1 ? self.idxForHighlightedCandidate : 0;
    //             candidateOnSelectHandler(candidateIdx);
    //         };

    //         const addressCandidateOnClickHandler = function(evt){
    //             const target = $(this);
    //             const targetIdx = +target.attr('data-candidate-index');
    //             candidateOnSelectHandler(targetIdx);
    //         };

    //         $textInput.on('keyup', searchInputOnKeyUpHandler);

    //         $body.on('click', '.js-select-address-candidate', addressCandidateOnClickHandler);

    //         $body.on('click', (evt)=>{
    //             if(!$addressCandidatesList.is(evt.target) && $addressCandidatesList.has(evt.target).length === 0) {
    //                 self.toggleAutoCompleteDropdownMenu(false);
    //             }
    //         });
    //     };

    //     this.init();

    // };

    const TilePreviewWindow = function(){

        // cache dom elements
        const $body = $('body');

        let $previewWindow = null;
        let $previewWindowImg = null; 
        let $releaseDateTxt = null; 

        this.init = ()=>{
            const tilePreviewWindowHtml = `
                <div class="tile-preview-window hide">
                    <img>
                    <div class='tile-preview-title fonr-size-2 avenir-demi text-right'>
                        <span class='margin-right-half val-holder-release-date'></span>
                    </div>
                </div>
            `;
            $previewWindow = $(tilePreviewWindowHtml);
            $body.append($previewWindow);

            $previewWindowImg = $previewWindow.find('img');
            $releaseDateTxt = $previewWindow.find('.val-holder-release-date');
        };

        this.show = (topLeftPos, imageUrl, date)=>{
            $previewWindow.css('top', topLeftPos.y);
            $previewWindow.css('left', topLeftPos.x);
            $previewWindowImg.attr('src', imageUrl);
            $releaseDateTxt.text(date);
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

    const CrosshairMarker = function(){

        // cache dom elements
        const $body = $('body');

        let crosshairMarker = null;
        let posOffset = 0;

        this.init = ()=>{
            const crosshairMarkerHtml = `<div class="crosshair-marker hide"></div>`;
            crosshairMarker = $(crosshairMarkerHtml);
            $body.append(crosshairMarker);
            posOffset = crosshairMarker.width() / 2;
        };

        this.setPos = (pos)=>{
            crosshairMarker.css('top', pos.y - posOffset);
            crosshairMarker.css('left', pos.x - posOffset);
            this.toggleVisibility(true);
        };

        this.toggleVisibility = (isVisible)=>{
            crosshairMarker.toggleClass('hide', !isVisible);
        };

        this.init();
    };

    const CustomizedTooltip = function(){

        // cache dom elements
        const $body = $('body');

        let tooltip = null;

        this.init = ()=>{
            const tooltipHtml = `<div class="customized-tooltip font-size--3 hide"></div>`;
            tooltip = $(tooltipHtml);
            $body.append(tooltip);
        };

        this.show = (content, targetDom)=>{
            tooltip.text(content);
            this.setTootipPos(targetDom);
            this.toggleVisibility(true);
        };

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

    const Observable = function(){
        this.observers = [];

        this.subscribe = (f)=>{
          this.observers.push(f);
        };
      
        this.unsubscribe = (f)=>{
          this.observers = this.observers.filter(subscriber => subscriber !== f);
        }

        this.notify = (data)=>{
            // console.log('notify', data);
            this.observers.forEach(observer => observer(data));
        }
    };


    // init app and core components
    const app = new WaybackApp();
    const appView = new AppView();

    // util functions
    function arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length){
            return false;
        }
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i]){
                return false;
            }
        }
        return true;
    }
    

}).catch(err => {
    // handle any errors
    console.error(err);
});

calcite.init();


