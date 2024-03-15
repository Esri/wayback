/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    /**
     * if true, it is in process of querying metadata
     */
    isQueryingMetadata: boolean;
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

        const { metadata, isQueryingMetadata, metadataAnchorScreenPoint } =
            this.props;

        if (!metadataAnchorScreenPoint) {
            return null;
        }

        if (!metadata && !isQueryingMetadata) {
            return null;
        }

        const containerStyle = {
            position: 'absolute',
            top: metadataAnchorScreenPoint.y - this.PositionOffset,
            left: metadataAnchorScreenPoint.x - this.PositionOffset,
            width: this.Width,
        } as React.CSSProperties;

        if (isQueryingMetadata) {
            return (
                <div className="popup-container" style={containerStyle}>
                    <div className="reticle-wrap"></div>

                    <div className="content-wrap text-white">
                        <calcite-loader text="Fetching Metadata..." />
                    </div>
                </div>
            );
        }

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
