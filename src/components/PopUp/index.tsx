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
import {
    CalciteButton,
    CalciteIcon,
    CalciteLoader,
} from '@esri/calcite-components-react';
import { Trans, useTranslation } from 'react-i18next';

interface IProps {
    /**
     * if true, it is in process of querying metadata
     */
    isQueryingMetadata: boolean;
    metadata: IWaybackMetadataQueryResult;
    metadataAnchorScreenPoint: IScreenPoint;
    onClose: () => void;
}

const WIDTH = 360;
const POSITION_OFFSET = 22.5;

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
            top: metadataAnchorScreenPoint.y - POSITION_OFFSET,
            left: metadataAnchorScreenPoint.x - POSITION_OFFSET,
            width: WIDTH,
        } as React.CSSProperties;
    }, [metadataAnchorScreenPoint]);

    const copyQueryLocation = () => {
        // const { queryLocation } = metadata;

        const text = `x: ${queryLocation.longitude.toFixed(
            5
        )} y:${queryLocation.latitude.toFixed(5)}`;
        navigator.clipboard.writeText(text);
    };

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
                <div className="close-btn text-white">
                    <CalciteButton
                        appearance="transparent"
                        kind="neutral"
                        scale="s"
                        iconStart="x"
                        label={t('closed_metadata_popup')}
                        data-testid="popup-close-button"
                        onClick={onClose}
                    ></CalciteButton>
                </div>

                <div className="text-wrap">
                    <p className="mb-2">
                        {
                            <Trans
                                i18nKey={
                                    date
                                        ? 'metadata_provider_source_with_acquisition_date'
                                        : 'metadata_provider_source'
                                }
                                values={{
                                    provider,
                                    source,
                                    formattedDate,
                                    releaseDate,
                                }}
                                components={{ b: <b /> }}
                            />
                        }
                    </p>
                    <p className="mb-2">
                        <Trans
                            i18nKey="metadata_resolution"
                            values={{ resolution: +resolution.toFixed(2) }}
                            components={{ b: <b /> }}
                        />
                    </p>
                    <p className="mb-2">
                        <Trans
                            i18nKey="metadata_accuracy"
                            values={{ accuracy: +accuracy.toFixed(2) }}
                            components={{ b: <b /> }}
                        />
                    </p>

                    <p
                        className="cursor-pointer hover:underline"
                        title={t('copy_coordinates')}
                        onClick={copyQueryLocation}
                    >
                        x: {queryLocation.longitude.toFixed(4)}
                        {'  '}y: {queryLocation.latitude.toFixed(4)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
