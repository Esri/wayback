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

import classNames from 'classnames';
import React, { FC } from 'react';
import MapView from '@arcgis/core/views/MapView';
import { ZoomToExtent } from '@components/ZoomToExtent/ZoomToExtent';
import { useTranslation } from 'react-i18next';
import { CopyLink } from '@components/CopyLink/CopyLink';
import { APP_FULL_EXTENT_CENTER, APP_FULL_EXTENT_ZOOM } from '@constants/map';
import { ScreenshotWidget } from '@components/ScreenshotWidget/ScreenshotWidget';

type Props = {
    mapView?: MapView;
    // children?: React.ReactNode;
};

/**
 * This component groups custom Map Action Buttons together at the left side of the map container
 */
export const MapActionButtonGroup: FC<Props> = ({ mapView }) => {
    const { t } = useTranslation();

    if (!mapView) {
        return null;
    }

    return (
        <div className={classNames('absolute left-4 top-[116px] z-10 ')}>
            <ZoomToExtent
                tooltip={t('zoom_to_full_extent')}
                onClick={() => {
                    mapView.goTo({
                        center: APP_FULL_EXTENT_CENTER,
                        zoom: APP_FULL_EXTENT_ZOOM,
                    });
                }}
            />

            <ScreenshotWidget mapView={mapView} />

            <CopyLink />
        </div>
    );
};
