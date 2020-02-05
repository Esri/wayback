// preview the tile image that interscets with the center of the map view
import { loadModules } from 'esri-loader';

import './style.scss';
import * as React from 'react';
import { IWaybackItem } from '../../types';
import { geometryFns } from 'helper-toolkit-ts';

import IMapView from 'esri/views/MapView';
import IWebMercatorUtils from 'esri/geometry/support/webMercatorUtils';
import IPoint from 'esri/geometry/Point';

interface IProps {
    mapView?: IMapView;
    previewWaybackItem: IWaybackItem;
    alternativeRNum4RreviewWaybackItem: number;
}

interface IState {
    top: number;
    left: number;
    imageUrl: string;
}

interface IParamGetImageUrl {
    level: number;
    row: number;
    column: number;
}

class PreviewWindow extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            top: 0,
            left: 0,
            imageUrl: '',
        };
    }
    
    GCStile2long(x: number, z: number) {
        return ((x / Math.pow(2, z) - 1) * 180);
    }

    GCStile2lat(y: number, z: number) {
        return (( 1 - y / Math.pow(2, z - 1)) * 90);
    }

    long2GCStile(lon: number, z: number) {
        return Math.floor(Math.pow(2, z) *(lon/180 + 1));
    }

    lat2GCStile(lat: number, z: number) {
        return Math.floor(Math.pow(2, z - 1) *(1 - lat/90));
    }
      

    getCurrentZoomLevel() {
        const { mapView } = this.props;

        let currentZoomLevel: any
        let currentActiveLayer: any = mapView.layerViews.getItemAt(0).layer.get('activeLayer')
        let currentWMTSTileSet = currentActiveLayer.tileMatrixSets.getItemAt(0).tileInfo.lods
        
        currentWMTSTileSet.forEach((level: { scale: number; level: number; resolution: number}) => {
            if (level.scale < (mapView.scale * Math.sqrt(2)) && level.scale > (mapView.scale / Math.sqrt(2))) {
                currentZoomLevel = level.level;
            }
            return currentZoomLevel || ''
        });
        return currentZoomLevel
    }

    getTileInfo() {
        const { mapView } = this.props;

        let currentZoomLevel: any
        currentZoomLevel = this.getCurrentZoomLevel()

        const center = mapView.center;

        // change to match zoom id algorithm used in getmetadata query
        const level = currentZoomLevel;

        // get the tile row, col num from the map center point
        const tileRow = this.lat2GCStile(center.latitude, level);
        const tileCol = this.long2GCStile(center.longitude, level);

        // convert the row and col number into the lat, lon, which is the coordinate of the top left corner of the map tile in center of map
        const tileLat = this.GCStile2lat(tileRow, level);
        const tileLon = this.GCStile2long(tileCol, level);

        console.log('converted GCS coordinates and level:\t', tileLat, tileLon, level)

        return {
            level,
            column: tileCol,
            row: tileRow,
            tileLat,
            tileLon,
        };
    }

    getImageUrl({ level, row, column }: IParamGetImageUrl) {
        const {
            previewWaybackItem,
            alternativeRNum4RreviewWaybackItem,
        } = this.props;

        console.log('rNums from Preview\t', previewWaybackItem.releaseNum, alternativeRNum4RreviewWaybackItem)

        const previewWindowImageUrl = previewWaybackItem.itemUrl
            // .replace(
            //     `/${previewWaybackItem.releaseNum}/`,
            //     `/${alternativeRNum4RreviewWaybackItem}/`)
            .replace('{rNum}', `${alternativeRNum4RreviewWaybackItem}`)
            .replace('{level}', level.toString())
            .replace('{row}', row.toString())
            .replace('{column}', column.toString());
        
        console.log(previewWindowImageUrl)

        return previewWindowImageUrl;
    }

    async getTilePosition(tileLon: number, tileLat: number) {
        const { mapView } = this.props;

        try {
            type Modules = [typeof IPoint, typeof IWebMercatorUtils];

            const [Point, webMercatorUtils] = await (loadModules([
                'esri/geometry/Point',
                'esri/geometry/support/webMercatorUtils',
            ]) as Promise<Modules>);

            // convert lat lon to x y and create a point object
            const tileXY = (tileLon, tileLat);
            
            const point = new Point({
                x: tileXY[0],
                y: tileXY[1],
                spatialReference: { wkid: 4326 },
            });

            // convert to screen point and we will use this val to position the preview window
            const tileTopLeftXY = mapView.toScreen(point);

            return {
                top: tileTopLeftXY.y,
                left: tileTopLeftXY.x,
            };
        } catch (err) {
            return null;
        }
    }

    async updatePreviewWindowState() {
        try {
            const tileInfo = this.getTileInfo();
            console.log(tileInfo.level)

            const imageUrl = this.getImageUrl({
                level: tileInfo.level,
                row: tileInfo.row,
                column: tileInfo.column,
            });


            const { top, left } = await this.getTilePosition(
                tileInfo.tileLon,
                tileInfo.tileLat
            );
            
            console.log(tileInfo.tileLon,
                tileInfo.tileLat)
            
            this.setState({
                imageUrl,
                top,
                left,
            });
        } catch (err) {}
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.previewWaybackItem !== this.props.previewWaybackItem) {
            this.updatePreviewWindowState();
        }
    }

    render() {
        const { previewWaybackItem } = this.props;

        if (!previewWaybackItem) {
            return null;
        }

        const { top, left, imageUrl } = this.state;

        const style = {
            position: 'absolute',
            top,
            left,
        } as React.CSSProperties;

        return (
            <div className="tile-preview-window" style={style}>
                <img src={imageUrl} />
                <div className="tile-preview-title">
                    <div className="margin-left-half trailer-0">
                        <span className="release-date-text">
                            <b>Wayback {previewWaybackItem.releaseDateLabel}</b>{' '}
                            preview
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default PreviewWindow;
