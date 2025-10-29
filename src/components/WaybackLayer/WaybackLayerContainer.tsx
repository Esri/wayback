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

import React, { useEffect, useMemo } from 'react';

import { useAppSelector } from '@store/configureStore';

import { activeWaybackItemSelector } from '@store/Wayback/reducer';
import { saveReleaseNum4ActiveWaybackItemToHashParams } from '@utils/urlParams';

import WaybackLayer from './WaybackLayer';

// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';
import { selectAnimationStatus } from '@store/AnimationMode/reducer';

type Props = {
    mapView?: MapView;
};

const WaybackLayerContainer: React.FC<Props> = ({ mapView }: Props) => {
    const activeWaybackItem = useAppSelector(activeWaybackItemSelector);

    const animationStatus = useAppSelector(selectAnimationStatus);

    const isVisible = useMemo(() => {
        // if(animationStatus !== null){
        //     return false
        // }

        return true;
    }, [animationStatus]);

    useEffect(() => {
        saveReleaseNum4ActiveWaybackItemToHashParams(
            activeWaybackItem.releaseNum
        );
    }, [activeWaybackItem]);

    return (
        <WaybackLayer
            mapView={mapView}
            isVisible={isVisible}
            activeWaybackItem={activeWaybackItem}
        />
    );
};

export default WaybackLayerContainer;
