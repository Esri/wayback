// preview the tile image that interscets with the center of the map view
// import { loadModules } from 'esri-loader';

import './style.scss';
import React from 'react';
import { IWaybackItem } from '../../types';
import { geometryFns } from 'helper-toolkit-ts';

// import IMapView from 'esri/views/MapView';
// import IWebMercatorUtils from 'esri/geometry/support/webMercatorUtils';
// import IPoint from 'esri/geometry/Point';

import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import {
    lngLatToXY
} from '@arcgis/core/geometry/support/webMercatorUtils';

interface IProps {
    mapView?: MapView;
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

    getTileInfo() {
        const { mapView } = this.props;

        const center = mapView.center;
        const level = mapView.zoom;

        // get the tile row, col num from the map center point
        const tileRow = geometryFns.lat2tile(center.latitude, level);
        const tileCol = geometryFns.long2tile(center.longitude, level);

        // convert the row and col number into the lat, lon, which is the coordinate of the top left corner of the map tile in center of map
        const tileLat = geometryFns.tile2lat(tileRow, level);
        const tileLon = geometryFns.tile2Long(tileCol, level);

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

        const previewWindowImageUrl = previewWaybackItem.itemURL
            .replace(
                `/${previewWaybackItem.releaseNum}/`,
                `/${alternativeRNum4RreviewWaybackItem}/`
            )
            .replace('{level}', level.toString())
            .replace('{row}', row.toString())
            .replace('{col}', column.toString());

        return previewWindowImageUrl;
    }

    getTilePosition(tileLon: number, tileLat: number) {
        const { mapView } = this.props;

        // convert lat lon to x y and create a point object
        const tileXY = lngLatToXY(tileLon, tileLat);

        const point = new Point({
            x: tileXY[0],
            y: tileXY[1],
            spatialReference: { wkid: 3857 },
        });

        // convert to screen point and we will use this val to position the preview window
        const tileTopLeftXY = mapView.toScreen(point);

        return {
            top: tileTopLeftXY.y,
            left: tileTopLeftXY.x,
        };

        // try {
        //     type Modules = [typeof IPoint, typeof IWebMercatorUtils];

        //     const [Point, webMercatorUtils] = await (loadModules([
        //         'esri/geometry/Point',
        //         'esri/geometry/support/webMercatorUtils',
        //     ]) as Promise<Modules>);

        //     // convert lat lon to x y and create a point object
        //     const tileXY = webMercatorUtils.lngLatToXY(tileLon, tileLat);

        //     const point = new Point({
        //         x: tileXY[0],
        //         y: tileXY[1],
        //         spatialReference: { wkid: 3857 },
        //     });

        //     // convert to screen point and we will use this val to position the preview window
        //     const tileTopLeftXY = mapView.toScreen(point);

        //     return {
        //         top: tileTopLeftXY.y,
        //         left: tileTopLeftXY.x,
        //     };
        // } catch (err) {
        //     return null;
        // }
    }

    updatePreviewWindowState() {
        try {
            const tileInfo = this.getTileInfo();

            const imageUrl = this.getImageUrl({
                level: tileInfo.level,
                row: tileInfo.row,
                column: tileInfo.column,
            });

            const { top, left } = this.getTilePosition(
                tileInfo.tileLon,
                tileInfo.tileLat
            );

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
