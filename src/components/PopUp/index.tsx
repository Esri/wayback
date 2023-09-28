// import { loadModules } from 'esri-loader';
import './style.css';
import React from 'react';
import { dateFns } from 'helper-toolkit-ts';

import {
    IWaybackMetadataQueryResult,
    IScreenPoint,
    // IWaybackItem,
} from '@typings/index';

interface IProps {
    metadata: IWaybackMetadataQueryResult;
    metadataAnchorScreenPoint: IScreenPoint;
    onClose: () => void;
}

class PopUp extends React.PureComponent<IProps> {
    private readonly Width = 360;
    private readonly PositionOffset = 22.5;

    constructor(props: IProps) {
        super(props);
    }

    formatMetadataDate() {
        const { metadata } = this.props;
        const { date } = metadata;

        const metadataDate = new Date(date);

        const year = metadataDate.getFullYear();
        const month = dateFns.getMonthName(metadataDate.getMonth(), true);
        const day = metadataDate.getDate();

        return `${month} ${day}, ${year}`;
    }

    render() {
        // const { targetLayer } = this.props;

        const { metadata, metadataAnchorScreenPoint } = this.props;

        if (!metadata || !metadataAnchorScreenPoint) {
            return null;
        }

        const containerStyle = {
            position: 'absolute',
            top: metadataAnchorScreenPoint.y - this.PositionOffset,
            left: metadataAnchorScreenPoint.x - this.PositionOffset,
            width: this.Width,
        } as React.CSSProperties;

        const { provider, source, resolution, accuracy, releaseDate, date } =
            metadata;

        // const releaseDate = 'targetLayer.releaseDateLabel';
        const formattedDate = this.formatMetadataDate();

        const providerAndCaptureDateInfo = date ? (
            <span>
                {provider} ({source}) image captured on <b>{formattedDate}</b>{' '}
                as shown in the <b>{releaseDate}</b> version of the World
                Imagery map.
            </span>
        ) : (
            <span>
                {provider} ({source}) imagery as shown in the{' '}
                <b>{releaseDate}</b> version of the World Imagery map.
            </span>
        );

        return (
            <div className="popup-container" style={containerStyle}>
                <div className="reticle-wrap"></div>

                <div className="content-wrap text-white">
                    <div className="text-wrap">
                        <p className="trailer-half">
                            {providerAndCaptureDateInfo}
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
                        onClick={this.props.onClose}
                    >
                        <span className="icon-ui-close"></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default PopUp;
