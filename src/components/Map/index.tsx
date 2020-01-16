import './style.scss';
import * as React from 'react';

import { loadCss, loadModules } from 'esri-loader';
import config from './config';
import appConfig from '../../app-config';
import ReferenceLayerToggle from './ReferenceLayerToggle';

import { IWaybackItem, IMapPointInfo, IExtentGeomety } from '../../types';

import IMapView from 'esri/views/MapView';
// import IWebMap from "esri/WebMap";
import IMap from 'esri/Map';
import IWMTSLayer from 'esri/layers/WMTSLayer';
// import IWebTileLayer from 'esri/layers/WebTileLayer';
import IWatchUtils from 'esri/core/watchUtils';
import IPoint from 'esri/geometry/Point';
import IWebMercatorUtils from 'esri/geometry/support/webMercatorUtils';
import ISearchWidget from 'esri/widgets/Search';
import IVectorTileLayer from 'esri/layers/VectorTileLayer';
import ILocate from 'esri/widgets/Locate';

interface IProps {
    defaultExtent?: IExtentGeomety;
    activeWaybackItem: IWaybackItem;
    onUpdateEnd?: (centerPoint: IMapPointInfo, currentZoomLevel: number) => void;
    onExtentChange?: (extent: IExtentGeomety) => void;
}

interface IState {
    mapView: IMapView;
    popupAnchorPoint: IPoint;
    isReferenceLayerVisible: boolean;
    previewWindowImageUrl: string;
    previewWindowPosition: {
        top: number;
        left: number;
    };
}

class Map extends React.PureComponent<IProps, IState> {
    private readonly WaybackLayerId = 'waybackTileLayer';
    private readonly ReferenceLayerId = 'HybridRefLayer';
    private mapDivRef = React.createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);

        this.state = {
            mapView: null,
            popupAnchorPoint: null,
            isReferenceLayerVisible: true,
            previewWindowPosition: {
                top: 0,
                left: 0,
            },
            previewWindowImageUrl: '',
        };

        this.toggleIsReferenceLayerVisible = this.toggleIsReferenceLayerVisible.bind(
            this
        );
    }

    async initMap() {
        loadCss();

        const { defaultExtent } = this.props;

        try {
            const container = this.mapDivRef.current;

            type Modules = [
                typeof IMapView,
                typeof IMap,
                typeof IVectorTileLayer
            ];

            const [MapView, Map, VectorTileLayer] = await (loadModules([
                'esri/views/MapView',
                'esri/Map',
                'esri/layers/VectorTileLayer',
            ]) as Promise<Modules>);

            const waybackLayer = await this.getWaybackLayer();

            const referenceLayer = new VectorTileLayer({
                id: this.ReferenceLayerId,
                portalItem: {
                    id: config['Hybrid-Reference-Layer'],
                },
            });

            const map = new Map({
                layers: [waybackLayer, referenceLayer],
            });

            const extent =
                defaultExtent ||
                appConfig.defaultMapExtent ||
                config.extents.default;

            const view = new MapView({
                container,
                map: map,
                extent,
            });

            this.setState({
                mapView: view,
            });

            view.when(() => {
                this.mapViewOnReadyHandler();
                this.initSearchWidget();
                this.initLocateWidget();
            });

        } catch (err) {
            console.error(err);
        }
    }

    async initSearchWidget() {
        const { mapView } = this.state;

        type Modules = [typeof ISearchWidget];

        try {
            const [Search] = await (loadModules([
                'esri/widgets/Search',
            ]) as Promise<Modules>);

            const searchWidget = new Search({
                view: mapView,
                popupEnabled: false,
                resultGraphicEnabled: false,
            });

            mapView.ui.add(searchWidget, {
                position: 'top-right',
                index: 2,
            });
        } catch (err) {
            console.error(err);
        }
    }

    async initLocateWidget() {
        const { mapView } = this.state;

        type Modules = [typeof ILocate];

        try {
            const [Locate] = await (loadModules([
                'esri/widgets/Locate',
            ]) as Promise<Modules>);

            const locateWidget = new Locate({
                view: mapView,
            });

            mapView.ui.add(locateWidget, {
                position: 'top-left',
                index: 2,
            });
        } catch (err) {
            console.error(err);
        }
    }

    async mapViewOnReadyHandler() {
        // const { onZoom } = this.props;
        const { mapView } = this.state;

        try {
            type Modules = [typeof IWatchUtils];

            const [watchUtils] = await (loadModules([
                'esri/core/watchUtils',
            ]) as Promise<Modules>);

            watchUtils.whenTrue(mapView, 'stationary', () => {
                // console.log('view is stationary');
                this.mapViewUpdateEndHandler();
            });
        } catch (err) {
            console.error(err);
        }
    }

    getCurrentZoomLevel() {

        const { mapView } = this.state;

        let currentZoomLevel: any
        let currentActiveLayer: any = mapView.layerViews.getItemAt(0).layer.get('activeLayer')
        let currentWMTSTileSet = currentActiveLayer.tileMatrixSets.getItemAt(0).tileInfo.lods
        currentWMTSTileSet.forEach((level: { scale: number; level: number; resolution: number}) => {
            if (level.scale < (mapView.scale * Math.sqrt(2)) && level.scale > (mapView.scale / Math.sqrt(2))) {
                console.log(level.level, level.scale)
                currentZoomLevel = level.level;
            }
            return currentZoomLevel || ''
        });
        return currentZoomLevel
    }

    // NOTE: needs getZoom()
    async mapViewUpdateEndHandler() {
        const { onUpdateEnd, onExtentChange } = this.props;
        const { mapView } = this.state;

        let currentZoomLevel = this.getCurrentZoomLevel()

        try {
            type Modules = [typeof IWebMercatorUtils];

            const [webMercatorUtils] = await (loadModules([
                'esri/geometry/support/webMercatorUtils',
            ]) as Promise<Modules>);

            // cneter the map
            // convert Mercator-coords to GCS-coords
            const center = mapView.center;
            const extent = webMercatorUtils.webMercatorToGeographic(
                mapView.extent
            );

            const mapViewCenterPointInfo: IMapPointInfo = {
                latitude: center.latitude,
                longitude: center.longitude,
                // change to match zoom id algorithm used in getmetadata query
                // zoom: mapView.zoom,
                zoom: currentZoomLevel,
                geometry: center.toJSON(),
            };

            onUpdateEnd(mapViewCenterPointInfo, currentZoomLevel);
            onExtentChange(extent.toJSON());
        } catch (err) {
            console.error(err);
        }
    }

    async updateWaybackLayer() {
        const { mapView } = this.state;

        const existingWaybackLayer = mapView.map.findLayerById(
            this.WaybackLayerId
        );

        if (existingWaybackLayer) {
            mapView.map.remove(existingWaybackLayer);
        }

        const activeWaybackLayer = await this.getWaybackLayer();

        // always add as the bottom most layer
        mapView.map.add(activeWaybackLayer, 0);
    }

    async getWaybackLayer() {
        const { activeWaybackItem } = this.props;

        try {
            type Modules = [typeof IWMTSLayer];

            const [WMTSLayer] = await (loadModules([
                'esri/layers/WMTSLayer',
            ]) as Promise<Modules>);

            const waybackLayer = new WMTSLayer ({
                // url: activeWaybackItem.itemURL,
                id: this.WaybackLayerId,
                url: 'https://wayback.maptiles.arcgis.com/GCS/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
                activeLayer: {
                    id: activeWaybackItem.itemReleaseName,
                }
            });

            return waybackLayer;

        } catch (err) {
            return null;
        }
    }

    toggleIsReferenceLayerVisible() {
        const { isReferenceLayerVisible, mapView } = this.state;

        const newVal = !isReferenceLayerVisible;

        this.setState(
            {
                isReferenceLayerVisible: newVal,
            },
            () => {
                const referenceLayer = mapView.map.findLayerById(
                    this.ReferenceLayerId
                );
                referenceLayer.visible = newVal;
            }
        );
    }

    componentDidUpdate(prevProps: IProps) {
        const { activeWaybackItem } = this.props;
        const { mapView } = this.state;

        if (
            activeWaybackItem &&
            activeWaybackItem !== prevProps.activeWaybackItem
        ) {
            if (!mapView) {
                this.initMap();
            } else {
                // switch active wayback item
                this.updateWaybackLayer();
            }
        }
    }

    componentDidMount() {
        // this.initMap();
    }

    render() {
        const { mapView, isReferenceLayerVisible } = this.state;

        const childrenElements = React.Children.map(
            this.props.children,
            (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    mapView,
                });
            }
        );

        return (
            <div className="map-container">
                <div id="mapDiv" ref={this.mapDivRef}>
                    <div className="loading-indicator">
                        <div className="loader is-active padding-leader-3 padding-trailer-3">
                            <div className="loader-bars"></div>
                        </div>
                    </div>
                </div>
                <ReferenceLayerToggle
                    isActive={isReferenceLayerVisible}
                    onClick={this.toggleIsReferenceLayerVisible}
                />
                {childrenElements}
            </div>
        );
    }
}

export default Map;
function newFunction() {
    let currentZoomLevel: any;
    return currentZoomLevel;
}

