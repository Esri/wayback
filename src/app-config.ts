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

import { IAppConfig } from './types';

const config: IAppConfig = {
    // The registered application id used for authentication, this appId below only works for the app hosted on arcgis.com domain
    appId: 'WaybackImagery',
    // shouldUseWaybackFootprintsLayer: false,
    // if on-premises is true, some functionalities (share app to social media and etc) will be disabled
    onPremises: false,
    defaultMapExtent: {
        xmin: -115.332,
        ymin: 36.048,
        xmax: -115.265,
        ymax: 36.08,
        spatialReference: {
            wkid: 4326,
        },
    },
};

export default config;
