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

import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
    isAnimationModeOnSelector,
    waybackItems4AnimationSelector,
} from '@store/AnimationMode/reducer';

// import IMapView from 'esri/views/MapView';

import AnimationPanel from './AnimationPanel';
import { IWaybackItem } from '@typings/index';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const AnimationPanelContainer: React.FC<Props> = ({ mapView }: Props) => {
    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const waybackItems4Animation: IWaybackItem[] = useSelector(
        waybackItems4AnimationSelector
    );

    if (!isAnimationModeOn || !waybackItems4Animation.length) {
        return null;
    }

    return (
        <AnimationPanel
            waybackItems4Animation={waybackItems4Animation}
            mapView={mapView}
        />
    );
};

export default AnimationPanelContainer;
