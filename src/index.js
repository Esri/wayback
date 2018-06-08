// import dependencies and libraries
import $ from 'jquery'
import * as esriLoader from 'esri-loader'
import * as calcite from 'calcite-web'

// import style files
import './style/index.scss';

// import other files
// import selectJson from './select.json' 


// app configs 
const ID_WEBMAP =  '86aa24cfcdf443109e3b7f2139ea6188';
const ID_WAYBACK_IMAGERY_LAYER = 'waybackImaegryLayer';

const URL_WAYBACK_IMAGERY_BASE = 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const URL_WAYBACK_IMAGERY_TILES = URL_WAYBACK_IMAGERY_BASE + '/tile/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_TILEMAP = URL_WAYBACK_IMAGERY_BASE + '/tilemap/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_SELECT = URL_WAYBACK_IMAGERY_BASE + '?f=json';

const KEY_RELEASE_NUM = 'M';


esriLoader.loadModules([
    'esri/views/MapView', 
    'esri/WebMap',
    "esri/geometry/Extent",

    "esri/layers/BaseTileLayer",
    "esri/request",
    "esri/core/watchUtils",
    "esri/geometry/geometryEngine",
    "esri/config",

    "dojo/domReady!"
]).then(([
    MapView, 
    WebMap,
    Extent,

    BaseTileLayer,
    esriRequest,
    watchUtils,
    geometryEngine,
    esriConfig
])=>{

    const WaybackApp = function(){

        this.dataModel = null;
        this.mapView = null;
        this.basemapTileElements = []; // list of basemap tile objects in current view  

        this.init = ()=>{

            this.initMap();

            this.fetchWaybackReleasesData(res=>{
                this.dataModel = new AppDataModel(res);
                this.initWaybackImageryLayer();
            });

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
                container: 'app',
            });

            this.setMapView(view);
            this.setMapEventHandlers(view);
            this.setBasemapViewWatcher(view);
        };

        this.initWaybackImageryLayer = ()=>{
            const mostRecentRelease = this.dataModel.getMostRecentReleaseNum();
            this.addWaybackImageryLayer(mostRecentRelease);
        };

        // get json file that will be used as a lookup table for all releases since 2014
        this.fetchWaybackReleasesData = (callback)=>{
            $.getJSON(URL_WAYBACK_IMAGERY_SELECT, response=>{
                callback(response.Selection);
            });
        };

        this.setMapView = (mapView)=>{
            this.mapView = mapView;
        };

        this.addWaybackImageryLayer = (releaseNum)=>{
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
        };

        this.getWaybackImageryLayer = ()=>{
            const waybackLyr = this.mapView.map.findLayerById(ID_WAYBACK_IMAGERY_LAYER) || null;
            return waybackLyr;
        }

        this.removeWaybackImageryLayer = ()=>{
            const waybackLyr = this.getWaybackImageryLayer();
            if(waybackLyr){
                this.mapView.map.remove(waybackLyr);
            }
        };

        this.setMapEventHandlers = (view)=>{
            view.on('click', (evt)=>{
                // console.log('click map', evt);
                this.getBasemapTileElement(evt.mapPoint);
            });
        };

        // watch the change of basemap tiles based on example from : https://jsbin.com/zojaxev/edit?html,output
        this.setBasemapViewWatcher = (view)=>{
            let basemapView;
            view.basemapView.baseLayerViews.on('change', changes => {
                if (!basemapView){
                    basemapView = changes.added[0];
                    watchUtils.whenFalse(basemapView, 'updating', f => {
                        this.setBasemapTileElements(basemapView._tileContainer.children);
                    });
                }
            });
        };

        this.setBasemapTileElements = (items)=>{
            this.basemapTileElements = items;
        };

        this.getBasemapTileElement = (mapPoint=null)=>{

            const tileClicked = mapPoint
            ? this.basemapTileElements.filter(d=>{
                const extentGeom = new Extent({
                    xmin: d.key.extent[0],
                    xmax: d.key.extent[1],
                    ymin: d.key.extent[2],
                    ymax: d.key.extent[3],
                    spatialReference: { wkid: 102100 }
                });
                return geometryEngine.intersects(extentGeom, mapPoint);
              })[0]
            : null; 

            // console.log(tileClicked);
            this.searchWayback(tileClicked.key.level, tileClicked.key.row, tileClicked.key.col);
        };

        this.searchWayback = (level, row, column)=>{

            this.dataModel.getReleaseItemsByLRC(level, row, column);
        };

        const WaybackImageryLayer = BaseTileLayer.createSubclass({

            properties: {
                urlTemplate: null,
                m: null // m encodes the release number
            },
    
            getTileUrl: function(level, row, col) {
                const m = this.m;
                return this.urlTemplate.replace("{m}", m).replace("{l}", level).replace("{r}", row).replace("{c}", col);
            },
        });

        this.init();

    };

    const AppDataModel = function(selectJsonResponse){

        this.releases = selectJsonResponse || null; // array of all release numbers since 2014
        this.releasesDict = null; // lookup table with release number as key, will need to use it to get the index of the element 

        this.init = ()=>{
            if(!this.releases || !this.releases.length){
                console.error('list of releases from the select.json file is required to init AppDataModel');
                return;
            }

            this.initReleasesDict();

            console.log(this.releasesDict);
        };

        this.initReleasesDict = ()=>{
            const dict = {};
            
            this.releases.forEach((element, index) => {
                const releaseNum = element[KEY_RELEASE_NUM];
                element.index = index;
                dict[releaseNum] = element;
            });

            this.releasesDict = dict; 
        };

        this.getMostRecentReleaseNum = ()=>{
            return this.releases[0][KEY_RELEASE_NUM];
        };

        // get the release number of the item before the given item... e.g. input=>Release Number for 2018 Release 10; output=>Release Number for 2018 Release 9
        this.getReleaseNumOneBefore = (releaseNum)=>{
            const prevReleaseIndex = this.releasesDict[+releaseNum].index + 1;
            return this.releases[prevReleaseIndex] ? this.releases[prevReleaseIndex][KEY_RELEASE_NUM] : null;
        };

        // get release numbers for all releases that have updated data for the give level, row, column
        this.getReleaseNumbersByLRC = (level, row, column, callback)=>{

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
                        const lastRelease = res.select[0] || rNum; 
                        results.push(lastRelease);

                        // we need to keep check previous releases to see if it has updated data for the selected area or not, 
                        // to do that, just start from the release before last release
                        const nextReleaseToCheck = this.getReleaseNumOneBefore(lastRelease); 

                        console.log(lastRelease, nextReleaseToCheck);
                        
                        if(nextReleaseToCheck){
                            tileRequest(nextReleaseToCheck);
                        } else {
                            console.log('final results', results);
                            callback(results);
                        }
                    },
                    error: function (request, textStatus, errorThrown) {
                        // console.log(request.getAllResponseHeaders());
                    }
                });

            };

            tileRequest(mostRecentRelease);
        };

        this.init();

    };

    const AppView = function(){

    };

    // init app and core components
    const app = new WaybackApp();
    

}).catch(err => {
    // handle any errors
    console.error(err);
});

calcite.init();


