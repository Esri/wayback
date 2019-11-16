import { loadModules } from 'esri-loader';
import './style.scss';
import * as React from 'react';

import WaybackManager from '../../core/WaybackManager';
import { dateFns } from 'helper-toolkit-ts';

import {
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IWaybackItem,
} from '../../types';
import IMapView from 'esri/views/MapView';
import IWatchUtils from 'esri/core/watchUtils';
import IPoint from 'esri/geometry/Point';

interface IProps {
    mapView?: IMapView;
    waybackManager?: WaybackManager;
    activeWaybackItem: IWaybackItem;
    previewWaybackItem: IWaybackItem;
}

interface IState {
    anchorPoint: IPoint;
    metadata: IWaybackMetadataQueryResult;
    metadataAnchorScreenPoint: IScreenPoint;
}

class PopUp extends React.PureComponent<IProps, IState> {
    private readonly Width = 360;
    private readonly PositionOffset = 22.5;

    constructor(props: IProps) {
        super(props);

        this.state = {
            anchorPoint: null,
            metadata: null,
            metadataAnchorScreenPoint: null,
        };

        this.onClose = this.onClose.bind(this);
    }

    setAnchorPoint(point: IPoint) {
        const { mapView } = this.props;

        this.setState(
            {
                anchorPoint: point,
                metadataAnchorScreenPoint: mapView.toScreen(point),
            },
            async () => {
                const response = await this.queryMetadata();
                this.setMetaData(response.metadata);
            }
        );
    }

    setMetaData(metadata?: IWaybackMetadataQueryResult) {
        this.setState({
            metadata,
        });
    }

    async initMapViewEventHandlers() {
        const { mapView } = this.props;

        try {
            type Modules = [typeof IWatchUtils];

            const [watchUtils] = await (loadModules([
                'esri/core/watchUtils',
            ]) as Promise<Modules>);

            mapView.on('click', (evt) => {
                // console.log('view on click, should show popup', evt.mapPoint);
                this.setAnchorPoint(evt.mapPoint);
            });

            watchUtils.watch(mapView, 'zoom', () => {
                // console.log('view zoom is on updating, should hide the popup', zoom);
                this.onClose();
            });

            watchUtils.watch(mapView, 'center', () => {
                // console.log('view center is on updating, should update the popup position');
                // need to update the screen point for popup anchor since the map center has changed
                this.updateScreenPoint4PopupAnchor();
            });
        } catch (err) {
            console.error(err);
        }
    }

    async queryMetadata() {
        const { waybackManager, activeWaybackItem, mapView } = this.props;

        const { anchorPoint } = this.state;

        try {
            const metadata = await waybackManager.getMetadata({
                releaseNum: activeWaybackItem.releaseNum,
                pointGeometry: anchorPoint.toJSON(),
                zoom: mapView.zoom,
            });

            return {
                metadata,
            };
        } catch (err) {
            console.error(err);

            return {
                metadata: null,
            };
        }
    }

    updateScreenPoint4PopupAnchor() {
        const { mapView } = this.props;
        const { anchorPoint, metadata } = this.state;

        if (anchorPoint && metadata) {
            const metadataAnchorScreenPoint = mapView.toScreen(anchorPoint);

            this.setState({
                metadataAnchorScreenPoint,
            });
        }
    }

    onClose() {
        this.setMetaData();
    }

    formatMetadataDate() {
        const { metadata } = this.state;
        const { date } = metadata;

        const metadataDate = new Date(date);

        const year = metadataDate.getFullYear();
        const month = dateFns.getMonthName(metadataDate.getMonth(), true);
        const day = metadataDate.getDate();

        return `${month} ${day}, ${year}`;
    }

    componentDidUpdate(prevProps: IProps) {
        const { mapView, previewWaybackItem } = this.props;

        if (prevProps.mapView !== mapView) {
            this.initMapViewEventHandlers();
        }

        if (prevProps.previewWaybackItem !== previewWaybackItem) {
            this.onClose();
        }
    }

    render() {
        const { activeWaybackItem } = this.props;

        const { metadata, metadataAnchorScreenPoint } = this.state;

        if (!metadata || !metadataAnchorScreenPoint) {
            return null;
        }

        const containerStyle = {
            position: 'absolute',
            top: metadataAnchorScreenPoint.y - this.PositionOffset,
            left: metadataAnchorScreenPoint.x - this.PositionOffset,
            width: this.Width,
        } as React.CSSProperties;

        const { provider, source, resolution, accuracy } = metadata;

        const releaseData = activeWaybackItem.releaseDateLabel;
        const formattedDate = this.formatMetadataDate();

        return (
            <div className="popup-container" style={containerStyle}>
                <div className="reticle-wrap"></div>

                <div className="content-wrap text-white">
                    <div className="text-wrap">
                        <p className="trailer-half">
                            {provider} ({source}) image captured on{' '}
                            <b>{formattedDate}</b> as shown in the{' '}
                            <b>{releaseData}</b> version of the World Imagery
                            map.
                        </p>
                        <p className="trailer-half">
                            <b>Resolution</b>: Pixels in the source image
                            <br />
                            represent a ground distance of{' '}
                            <b>{+resolution.toFixed(2)} meters</b>.
                        </p>
                        <p className="trailer-0">
                            <b>Accuracy</b>: Objects displayed in this image
                            <br />
                            are within <b>{+accuracy.toFixed(2)} meters</b> of
                            true location.
                        </p>
                    </div>

                    <div
                        className="close-btn text-white text-center cursor-pointer"
                        onClick={this.onClose}
                    >
                        <span className="icon-ui-close"></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default PopUp;
