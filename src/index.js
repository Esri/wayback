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
const ID_WEBMAP =  '86aa24cfcdf443109e3b7f2139ea6188';
const ID_WAYBACK_IMAGERY_LAYER = 'waybackImaegryLayer';

const URL_WAYBACK_IMAGERY_BASE = 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const URL_WAYBACK_IMAGERY_TILES = URL_WAYBACK_IMAGERY_BASE + '/tile/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_TILEMAP = URL_WAYBACK_IMAGERY_BASE + '/tilemap/{m}/{l}/{r}/{c}';
const URL_WAYBACK_IMAGERY_SELECT = URL_WAYBACK_IMAGERY_BASE + '?f=json';

const KEY_RELEASE_NUM = 'M';
const KEY_RELEASE_NAME = 'Name';

const DOM_ID_MAP_CONTAINER = 'mapDiv';
const DOM_ID_TIMELINE = 'timelineWrap';
const DOM_ID_BARCHART_WRAP = 'barChartWrap';
const DOM_ID_BARCHART = 'barChartDiv';


esriLoader.loadModules([
    'esri/views/MapView', 
    'esri/WebMap',
    "esri/geometry/Extent",
    "esri/geometry/Point",

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
    Point,

    BaseTileLayer,
    esriRequest,
    watchUtils,
    geometryEngine,
    esriConfig
])=>{

    const WaybackApp = function(){

        this.dataModel = null;
        this.mapView = null;
        this.waybackImageryTileElements = []; // list of wayback imagery tile objects in current view  
        // this.waybackImagerySearchResults = [];

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
                container: DOM_ID_MAP_CONTAINER,
            });

            this.setMapView(view);
            this.setMapEventHandlers(view);
            // this.setBasemapViewWatcher(view);
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

        // this.setWaybackImagerySearchResults = (results=[])=>{
        //     this.waybackImagerySearchResults = results;
        // };

        // this.getWaybackImagerySearchResults = ()=>{
        //     return this.waybackImagerySearchResults;
        // };

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

            this.setWatcherForLayerUpdateEndEvt(waybackLyr);
        };

        this.getWaybackImageryLayer = ()=>{
            const waybackLyr = this.mapView.map.findLayerById(ID_WAYBACK_IMAGERY_LAYER) || null;
            return waybackLyr;
        }

        this.getReleaseNumFromWaybackImageryLayer = ()=>{
            const waybackLyr = this.getWaybackImageryLayer();
            return waybackLyr.m;
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

                appView.toggleLoadingIndicator(true);
            });
        };

        // // imspired by this example taht watch the change of basemap tiles: https://jsbin.com/zojaxev/edit?html,output
        this.setWatcherForLayerUpdateEndEvt = (layer)=>{
            this.mapView.whenLayerView(layer)
            .then((layerView)=>{
                // console.log('layerView', layerView);
                // The layerview for the layer
                watchUtils.whenFalse(layerView, 'updating', f => {
                    // console.log(layerView._tileContainer.children);
                    this.setWaybackImageryTileElements(layerView._tileContainer.children);
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

                // console.log(tileTopLeftPointToScreen.x, tileTopLeftPointToScreen.y);

                return isInCurrentMapExt;
            });

            // console.log(this.waybackImageryTileElements);
        };

        this.getWaybackImageryTileElement = (mapPoint=null)=>{

            // console.log(this.waybackImageryTileElements);

            let minDist = Number.POSITIVE_INFINITY;
            let tileClicked = null;

            if(this.waybackImageryTileElements.length){
                this.waybackImageryTileElements.forEach(d=>{
                    const dist = mapPoint.distance(d.centroid);
                    if(dist < minDist){
                        minDist = dist;
                        tileClicked = d;
                    }
                });
    
                // console.log(tileClicked);
                // console.log(tileClicked.key.level, tileClicked.key.row, tileClicked.key.col);
    
                this.searchWayback(tileClicked.key.level, tileClicked.key.row, tileClicked.key.col);
            } else {
                console.log('wayback imagery is still loading');
            }

        };

        // search all releases with updated data for tile image at given level, row, col
        this.searchWayback = (level, row, column)=>{

            // this.setWaybackImagerySearchResults(null); // reset the WaybackImagerySearchResults

            const onSuccessHandler = (res)=>{
                // console.log('onSuccessHandler', res);

                // download the tile image file using each release number in res, convert to to dataUri to so we can check if there are duplicated items
                const resolvedTileDataUriArray = res.map(rNum=>{
                    const tileURL = this.getWaybackTileURL(rNum, level, row, column);
                    return this.imageToDataUri(tileURL, rNum);
                });

                // check and remove the duplicated items once DataUri for all images are resolved
                Promise.all(resolvedTileDataUriArray).then(resolvedResults => {

                    const uniqueDataURIs = [];
                    const resultsWithDuplicatesRemoved = [];

                    resolvedResults.forEach((d, i)=>{
                        if(!uniqueDataURIs.includes(d.dataUri)){
                            const rName = this.dataModel.getReleaseName(d.release);
                            const rDate = this.dataModel.getReleaseDate(d.release);
                            const rDateTime = this.dataModel.getReleaseDate(d.release, true);
                            const isActive = i===0 ? true : false;

                            uniqueDataURIs.push(d.dataUri);

                            resultsWithDuplicatesRemoved.push({
                                release: d.release,
                                releaseName: rName,
                                releaseDate: rDate,
                                releaseDateTime: rDateTime,
                                imageUrl: d.imageUrl,
                                isActive: isActive,
                                isSelected: false
                            });
                        }
                    });

                    const releaseNumOfVisibleWaybackLyr = this.getReleaseNumFromWaybackImageryLayer();

                    // console.log(releaseNumOfVisibleWaybackLyr);

                    // check if the latest release number from resultsWithDuplicatesRemoved (which will be turned on in the timeline by default) is same with 
                    // release number used to create the wayback layer, if not, redraw wayback layer using latest release number from resultsWithDuplicatesRemoved to keep 
                    // timeline and wayback layer synced
                    if(resultsWithDuplicatesRemoved[0].release !== releaseNumOfVisibleWaybackLyr){
                        this.addWaybackImageryLayer(resultsWithDuplicatesRemoved[0].release);
                    }

                    // this.setWaybackImagerySearchResults(resultsWithDuplicatesRemoved);

                    appView.updateViewModel(resultsWithDuplicatesRemoved);

                    // console.log(this.waybackImagerySearchResults);
                });

            };

            this.dataModel.getReleaseNumbersByLRC(level, row, column, onSuccessHandler);
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

        const WaybackImageryLayer = BaseTileLayer.createSubclass({

            properties: {
                urlTemplate: null,
                m: null // m encodes the release number
            },
    
            getTileUrl: function(level, row, col) {
                const m = this.m;
                // console.log('WaybackImageryLayer getTileUrk', level, row, col);
                return this.urlTemplate.replace("{m}", m).replace("{l}", level).replace("{r}", row).replace("{c}", col);
            },
    
        });

        this.init();

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
                const rNum = d[KEY_RELEASE_NUM];
                const rDate = this.extractDateFromStr(d[KEY_RELEASE_NAME]);
                d.index = index;
                d.releaseDate = rDate
                d.releaseDatetime = this.convertToDate(rDate);
                dict[rNum] = d;

                return d;
            });

            this.initReleasesDict(dict);
        };

        this.initReleasesDict = (dict={})=>{
            this.releasesDict = dict; 
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
        this.getReleaseNumbersByLRC = (level, row, column, callback)=>{

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
                            
                            if(callback){
                                callback(results);
                            }
                        }
                    },
                    error: function (request, textStatus, errorThrown) {
                        // console.log(request.getAllResponseHeaders());
                    }
                });

            };

            tileRequest(mostRecentRelease);
        };

        this.extractDateFromStr = (inputStr)=>{
            const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
            const results = inputStr.match(regexpYYYYMMDD);
            return results.length ? results[0] : inputStr;
        };

        this.convertToDate = (dateInStr)=>{
            const dateParts = dateInStr.split('-');
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        };

        this.init(selectJsonResponse);

    };

    const AppView = function(){

        // cache dom elements
        const $body = $('body');
        const $vizInfoContainers = $('.viz-info-containers');
        const $numOfReleasesTxt = $('.val-holder-num-of-releases');
        const $waybackDataLoadingIndicator = $('.wayback-data-loading-indicator');

        // app view core components
        this.viewModel =  null; // view model that stores wayback search results data and its states (isActive, isSelected) that we use to populate data viz containers 
        this.timeline = null;
        this.barChart = null;

        this.init = ()=>{
            this.viewModel = new ViewModel(this);
            this.timeline = new Timeline(DOM_ID_TIMELINE);
            this.barChart = new BarChart(DOM_ID_BARCHART);

            // init observers after all components are ready
            this.viewModel.initObservers(); 
        };

        this.updateViewModel = (results=[])=>{
            this.toggleLoadingIndicator(false);
            this.viewModel.setData(results);
        };

        this.setNumOfReleasesTxt = (results=[])=>{
            $numOfReleasesTxt.text(results.length);
        };

        this.toggleLoadingIndicator = (isLoading)=>{
            $waybackDataLoadingIndicator.toggleClass('is-active' , isLoading);
            $vizInfoContainers.toggleClass('hide' , isLoading);
        };

        const ViewModel = function(appView){

            this.data = [];

            // state observers
            this.observerViewModelUpdate = null; 
            this.observerForActiveItem = null; 

            this.setData = (data)=>{
                this.observerViewModelUpdate.notify(data);
                this.data = data;
            }

            this.setActiveItem = (rNum)=>{
                this.observerForActiveItem.notify(rNum);
                this.data.forEach(d=>{
                    const isActive = (+d.release === +rNum) ? true : false;
                    d.isActive = isActive;
                });
            };

            this.setSelectedItem = (rNum, isSelected)=>{
                this.data.forEach(d=>{
                    if(+d.release === +rNum){
                        d.isSelected = isSelected;
                    }
                });
            };

            this.getData = ()=>{
                return this.data;
            };

            this.initObservers = ()=>{
                // watch the change of view data model (wayback imagery search results) to make sure the results are populated to each viz container
                this.observerViewModelUpdate = new Observable();
                this.observerViewModelUpdate.subscribe(appView.timeline.populate);
                this.observerViewModelUpdate.subscribe(appView.barChart.populate);
                this.observerViewModelUpdate.subscribe(appView.setNumOfReleasesTxt);
    
                // watch the selected wayback result to make sure the item for selected release gets highlighted in each viz container, also add the wayback layer for selected release to map
                this.observerForActiveItem = new Observable();
                this.observerForActiveItem.subscribe(app.addWaybackImageryLayer);
                this.observerForActiveItem.subscribe(appView.timeline.setActiveItem);
                this.observerForActiveItem.subscribe(appView.barChart.setActiveItem);
            };
        };

        const Timeline = function(constainerID){
            
            const $container = $('#' + constainerID);

            this.setActiveItem= (rNum)=>{
                const targetItem = $(`.timeline-item[data-release-number="${rNum}"]`);
                targetItem.addClass('is-active');
                targetItem.siblings().removeClass('is-active');
            };

            this.populate = (data)=>{

                const timelineItemsHtmlStr = data.map((d,idx)=>{

                    const rNum = d.release;
                    // const rName = d.releaseName;
                    const rDate = d.releaseDate;
                    const isActiveClass = d.isActive ? 'is-active' : '';
                    // const rNameShortened = rName.split(' ').slice(2).join(' ');

                    const htmlStr = `
                        <div class='timeline-item padding-trailer-1 ${isActiveClass} js-show-wayback-imagery' data-release-number='${rNum}'>
                            <div class='timeline-item-title'>
                                <span class='padding-leader-quarter padding-trailer-quarter padding-left-half padding-right-half font-size--2'>${rDate}</span>
                            </div>

                            <div class='tile-image-preview'>
                                <img src="${d.imageUrl}" alt="${d.releaseName}">
                            </div>
                        </div>
                    `;

                    return htmlStr;
                }).join('');

                $container.html(timelineItemsHtmlStr);
                
            };

        };

        const BarChart = function(containerID){

            const self = this;
            const container = d3.select("#"+containerID);
            const $barChartTitleTxt = $('.bar-chart-title');
        
            const svg = container.append("svg").style("width", "100%").style("height", "100%");
            const margin = {top: 10, right: 20, bottom: 30, left: 20};
            const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            let width = 0;
            let height = 0;
            let xScale = null; // = d3.scaleTime().range([0, width]).domain([new Date(2014, 0, 1), new Date(2018, 10, 1)]).nice();
            let bars = null;
            
            this.isReady = false;

            this.init = ()=>{

                const containerRect = container.node().getBoundingClientRect();

                if(containerRect.width <= 0 || containerRect.height <= 0){
                    // console.log('constainer size is less than 0');
                    return;
                }

                width = containerRect.width - margin.left - margin.right;
                height = containerRect.height - margin.top - margin.bottom;
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

                // g.append("g")
                //   .attr("class", "axis axis--y")
                //   .call(d3.axisLeft(y).ticks(0));
            };

            this.populate = (data)=>{

                if(!this.isReady){
                    this.init();
                } 

                if(this.isReady){
                    bars = g.selectAll(".bar")
                    .remove()
                    .exit()
                    .data(data)		
                    .enter().append("rect")
                    .attr('class', function(d, i){
                        // highlight the bar for the active item
                        let classes = ['bar'];
                        if(d.isActive){
                            classes.push('highlight');
                            self.setBarChartTitle(d.releaseName);
                        }
                        return classes.join(' ');
                    })
                    .attr("x", function(d) { 
                        return xScale(d.releaseDateTime); 
                    })
                    .attr("y", 0)
                    .attr("width", 4)
                    .attr("height", height)
                    .on("click", function(d){
                        // console.log(d);
                        appView.viewModel.setActiveItem(d.release);
                        self.setBarChartTitle(d.releaseName);
                    });
                }
            };

            this.setActiveItem = (rNum)=>{
                if(bars){
                    bars.classed("highlight", false);
                    bars.filter(function(item){
                        return item.release === +rNum;
                    }).classed("highlight", true);
                }
            };

            // the chart won't be ready till the container is visible, therefore, need to call this function to populate the chart if it's not ready but the search results are there
            this.checkIfIsReady = ()=>{
                const viewModelData = appView.viewModel.getData();
                if(viewModelData.length && !this.isReady){
                    this.populate(viewModelData);
                }
            };

            this.setBarChartTitle = (titleStr)=>{
                $barChartTitleTxt.text(titleStr)
            }; 

        };

        const initEventHandlers = (()=>{

            $body.on('click', '.js-show-wayback-imagery', function(evt){
                const traget = $(this);
                const rNum = traget.attr('data-release-number');
                appView.viewModel.setActiveItem(rNum);
                // console.log('display wayback imagery for release', rNum);
            });

            $body.on('click', '.js-toggle-viz-info-container', function(evt){
                const traget = $(this);
                const targetContainerID = traget.attr('data-target-container-id');

                $vizInfoContainers.children().addClass('hide');

                if(targetContainerID){
                    $vizInfoContainers.find('#'+targetContainerID).removeClass('hide');
                }
                
                traget.siblings().removeClass('is-active');
                traget.addClass('is-active');
                // console.log(targetContainerID);

                if(targetContainerID === DOM_ID_BARCHART_WRAP){
                    appView.barChart.checkIfIsReady();
                }
            });

        })();

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
    

}).catch(err => {
    // handle any errors
    console.error(err);
});

calcite.init();


