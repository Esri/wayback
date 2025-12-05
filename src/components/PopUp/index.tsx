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
import React, { FC, useMemo } from 'react';
import { dateFns } from 'helper-toolkit-ts';

import {
    IWaybackMetadataQueryResult,
    IScreenPoint,
    // IWaybackItem,
} from '@typings/index';
import { CalciteIcon, CalciteLoader } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';

interface IProps {
    /**
     * if true, it is in process of querying metadata
     */
    isQueryingMetadata: boolean;
    metadata: IWaybackMetadataQueryResult;
    metadataAnchorScreenPoint: IScreenPoint;
    onClose: () => void;
}

const Width = 360;
const PositionOffset = 22.5;

const PopUp: FC<IProps> = ({
    metadata,
    isQueryingMetadata,
    metadataAnchorScreenPoint,
    onClose,
}: IProps) => {
    const { t } = useTranslation();

    const {
        provider,
        source,
        resolution,
        accuracy,
        releaseDate,
        date,
        queryLocation,
    } = metadata || {};

    const formattedDate = useMemo(() => {
        if (!date) {
            return '';
        }

        const metadataDate = new Date(date);

        const year = metadataDate.getFullYear();
        const month = dateFns.getMonthName(metadataDate.getMonth(), true);
        const day = metadataDate.getDate();

        return `${month} ${day}, ${year}`;
    }, [date]);

    const containerStyle = useMemo(() => {
        if (!metadataAnchorScreenPoint) {
            return {};
        }

        return {
            position: 'absolute',
            top: metadataAnchorScreenPoint.y - PositionOffset,
            left: metadataAnchorScreenPoint.x - PositionOffset,
            width: Width,
        } as React.CSSProperties;
    }, [metadataAnchorScreenPoint]);

    const copyQueryLocation = () => {
        // const { queryLocation } = metadata;

        const text = `x: ${queryLocation.longitude.toFixed(
            5
        )} y:${queryLocation.latitude.toFixed(5)}`;
        navigator.clipboard.writeText(text);
    };

    const providerAndCaptureDateInfo = date ? (
        <span>
            {provider} ({source}) image captured on <b>{formattedDate}</b> as
            shown in the <b>{releaseDate}</b> version of the World Imagery map.
        </span>
    ) : (
        <span>
            {provider} ({source}) imagery as shown in the <b>{releaseDate}</b>{' '}
            version of the World Imagery map.
        </span>
    );

    if (!metadataAnchorScreenPoint) {
        return null;
    }

    if (!metadata && !isQueryingMetadata) {
        return null;
    }

    if (isQueryingMetadata) {
        return (
            <div className="popup-container" style={containerStyle}>
                <div className="reticle-wrap"></div>

                <div className="content-wrap text-white">
                    <CalciteLoader text={t('fetching_metadata')} scale="s" />
                </div>
            </div>
        );
    }

    return (
        <div className="popup-container" style={containerStyle}>
            <div className="reticle-wrap"></div>

            <div
                className="content-wrap text-white"
                // this "data-testid" attribute will be used by the script that monitors the health of this app
                data-testid="popup-content"
            >
                <div className="text-wrap">
                    <p className="mb-2">{providerAndCaptureDateInfo}</p>
                    <p className="mb-2">
                        <b>Resolution</b>: Pixels in the source image
                        <br />
                        represent a ground distance of{' '}
                        <b>{+resolution.toFixed(2)} meters</b>.
                    </p>
                    <p className="mb-2">
                        <b>Accuracy</b>: Objects displayed in this image
                        <br />
                        are within <b>{+accuracy.toFixed(2)} meters</b> of true
                        location.
                    </p>

                    <p
                        className="cursor-pointer hover:underline"
                        title="click to copy the coordinates of this location"
                        onClick={copyQueryLocation}
                    >
                        x: {queryLocation.longitude.toFixed(4)}
                        {'  '}y: {queryLocation.latitude.toFixed(4)}
                    </p>
                </div>

                <div
                    className="close-btn text-white text-center cursor-pointer"
                    onClick={onClose}
                >
                    {/* <span className="icon-ui-close"></span> */}
                    <CalciteIcon icon="x" />
                </div>
            </div>
        </div>
    );
};

export default PopUp;
