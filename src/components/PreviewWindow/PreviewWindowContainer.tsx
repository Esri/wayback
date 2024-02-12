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

import React, { useContext, useEffect } from 'react';

import {
    useSelector,
    // useDispatch,
    // batch
} from 'react-redux';

import {
    previewWaybackItemSelector,
    releaseNum4AlternativePreviewWaybackItemSelector,
} from '@store/Wayback/reducer';

// import TilePreviewWindow from './index';
import PreviewWindow from './PreviewWindow';

import MapView from '@arcgis/core/views/MapView';
import { AppContext } from '@contexts/AppContextProvider';

type Props = {
    mapView?: MapView;
};

const PreviewWindowContainer: React.FC<Props> = ({ mapView }: Props) => {
    const { isMobile } = useContext(AppContext);

    const previewWaybackItem = useSelector(previewWaybackItemSelector);

    const releaseNum4AlternativePreviewWaybackItem = useSelector(
        releaseNum4AlternativePreviewWaybackItemSelector
    );

    if (isMobile) {
        return null;
    }

    return (
        <PreviewWindow
            previewWaybackItem={previewWaybackItem}
            alternativeRNum4RreviewWaybackItem={
                releaseNum4AlternativePreviewWaybackItem
            }
            mapView={mapView}
        />
    );
};

export default PreviewWindowContainer;
