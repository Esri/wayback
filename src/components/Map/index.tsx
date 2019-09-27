import './style.scss';
import * as React from 'react';

import { loadCss, loadModules } from "esri-loader";
import config from './config';

import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";

interface IProps {

}

interface IState {

}

class Map extends React.PureComponent<IProps, IState> {

    private mapDivRef = React.createRef<HTMLDivElement>()

    constructor(props:IProps){
        super(props);
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
    
            const webmap = new WebMap({
                portalItem: {
                    id: config['web-map-id']
                }
            });
    
            const view = new MapView({
                container,
                map: webmap
            });
    
        } catch(err){
            console.error(err)
        }
    }

    componentDidMount(){
        this.initMap();
    }

    render(){
        return(
            <div id='mapDiv' ref={this.mapDivRef}>Map</div>
        );
    }

};

export default Map;