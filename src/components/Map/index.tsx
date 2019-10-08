import './style.scss';
import * as React from 'react';

import { loadCss, loadModules } from "esri-loader";
import config from './config';

import { IWaybackItem, IMapPointInfo, IScreenPoint, IExtentGeomety } from '../../types';

import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IWebTileLayer from 'esri/layers/WebTileLayer';
import IWatchUtils from 'esri/core/watchUtils';
import IPoint from 'esri/geometry/Point';
import IWebMercatorUtils from "esri/geometry/support/webMercatorUtils"

interface IProps {
    activeWaybackItem:IWaybackItem,
    isPopupVisible:boolean,

    onClick?:(mapPoint:IMapPointInfo, screenPoint:IScreenPoint)=>void,
    onZoom?:(zoom?:number)=>void
    onUpdateEnd?:(centerPoint:IMapPointInfo)=>void
    popupScreenPointOnChange?:(screenPoint:IScreenPoint)=>void
    onExtentChange?:(extent:IExtentGeomety)=>void
}

interface IState {
    mapView:IMapView,
    popupAnchorPoint:IPoint
}

class Map extends React.PureComponent<IProps, IState> {

    private readonly WaybackLayerId = 'waybackTileLayer'
    private mapDivRef = React.createRef<HTMLDivElement>()

    constructor(props:IProps){
        super(props);

        this.state = {
            mapView: null,
            popupAnchorPoint: null
        }
    }

    async initMap(){

        loadCss();

        try {

            const container = this.mapDivRef.current;

            type Modules = [
                typeof IMapView,
                typeof IWebMap
            ];
    
            const [ MapView, WebMap ] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap'
            ]) as Promise<Modules>);

            const waybackLayer = await this.getWaybackLayer();
    
            const webmap = new WebMap({
                portalItem: {
                    id: config['web-map-id']
                },
                layers: [waybackLayer]
            });
    
            const view = new MapView({
                container,
                map: webmap
            });

            this.setState({
                mapView: view
            })

            view.when(()=>{
                this.mapViewOnReadyHandler();
            });

        } catch(err){
            console.error(err)
        }
    }

    async mapViewOnReadyHandler(){

        const { onZoom } = this.props;
        const { mapView } = this.state;

        try {

            type Modules = [
                typeof IWatchUtils
            ];
    
            const [ watchUtils ] = await (loadModules([
                'esri/core/watchUtils'
            ]) as Promise<Modules>);

            mapView.on('click', (evt)=>{
                // console.log('view on click, should show popup', evt.mapPoint);
                this.mapViewOnClickHandler(evt.mapPoint);
            });

            watchUtils.watch(mapView, "zoom", (zoom)=>{
                // console.log('view zoom is on updating, should hide the popup', zoom);
                onZoom(zoom);
            });

            watchUtils.watch(mapView, "center", (center)=>{
                // console.log('view center is on updating, should update the popup position');
                // need to update the screen point for popup anchor since the map center has changed
                this.updateScreenPoint4PopupAnchor();
            });

            watchUtils.whenTrue(mapView, "stationary", (val)=>{
                // console.log('view is stationary');
                this.mapViewUpdateEndHandler();
            });

            // watchUtils.whenFalse(mapView, "stationary", (evt)=>{
            //     // console.log('view is moving', evt);
            // });

        } catch(err){
            console.error(err);
        }
    }

    mapViewOnClickHandler(mapPoint:IPoint){
        const { onClick } = this.props;
        const { mapView } = this.state;

        this.setState({
            popupAnchorPoint:mapPoint
        }, ()=>{

            const popupAnchorPointInfo:IMapPointInfo = {
                latitude:mapPoint.latitude,
                longitude:mapPoint.longitude,
                zoom: mapView.zoom,
                geometry: mapPoint.toJSON()
            };

            const popupAnchorScreenPoint = mapView.toScreen(mapPoint);
    
            onClick(popupAnchorPointInfo, popupAnchorScreenPoint);
        });
    }

    async mapViewUpdateEndHandler(){
        const { onUpdateEnd, onExtentChange } = this.props;
        const { mapView } = this.state;

        try {

            type Modules = [
                typeof IWebMercatorUtils
            ];
    
            const [ webMercatorUtils ] = await (loadModules([
                "esri/geometry/support/webMercatorUtils"
            ]) as Promise<Modules>);
    
            const center = mapView.center;
            
            const extent = webMercatorUtils.webMercatorToGeographic(mapView.extent);
    
            const mapViewCenterPointInfo:IMapPointInfo = {
                latitude:center.latitude,
                longitude:center.longitude,
                zoom: mapView.zoom,
                geometry: center.toJSON()
            }
    
            onUpdateEnd(mapViewCenterPointInfo);
    
            onExtentChange(extent.toJSON());

        } catch(err){
            console.error(err);
        }

    }

    updateScreenPoint4PopupAnchor(){
        const { popupScreenPointOnChange, isPopupVisible } = this.props;
        const { mapView, popupAnchorPoint } = this.state;

        if( popupAnchorPoint && isPopupVisible ){
            const popupAnchorScreenPoint = mapView.toScreen(popupAnchorPoint);
            popupScreenPointOnChange(popupAnchorScreenPoint);
        }
    }

    async updateWaybackLayer(){

        const { mapView } = this.state;

        const existingWaybackLayer = mapView.map.findLayerById(this.WaybackLayerId);

        if(existingWaybackLayer){
            mapView.map.remove(existingWaybackLayer);
        }

        const activeWaybackLayer = await this.getWaybackLayer();

        // always add as the bottom most layer
        mapView.map.add(activeWaybackLayer, 0);
    }

    async getWaybackLayer(){

        const { activeWaybackItem } = this.props;

        try {

            type Modules = [
                typeof IWebTileLayer
            ];
    
            const [ WebTileLayer ] = await (loadModules([
                'esri/layers/WebTileLayer'
            ]) as Promise<Modules>);

            const waybackLayer = new WebTileLayer({
                id: this.WaybackLayerId,
                urlTemplate: activeWaybackItem.itemURL
            });

            return waybackLayer

        } catch(err){

            return null;
        }
    }

    componentDidUpdate(prevProps:IProps, prevState:IState){

        const { activeWaybackItem } = this.props;
        const { mapView } = this.state;

        if(activeWaybackItem && (activeWaybackItem !== prevProps.activeWaybackItem)){

            if(!mapView){
                this.initMap();
            } else {
                // switch active wayback item
                this.updateWaybackLayer();
            }
        }

    }

    componentDidMount(){
        // this.initMap();
    }

    render(){
        return(
            <div id='mapDiv' ref={this.mapDivRef}>
                <div className='loading-indicator'>
                    <div className="loader is-active padding-leader-3 padding-trailer-3">
                        <div className="loader-bars"></div>
                    </div>
                </div>
            </div>
        );
    }

};

export default Map;