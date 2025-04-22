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

import { color } from 'd3';
import { isMobileDevice } from 'helper-toolkit-ts/dist/misc';

export const SIDEBAR_WIDTH = 300;
export const SIDEBAR_HEIGHT_MOBILE = 300;
export const GUTTER_WIDTH = 50;
export const MOBILE_HEADER_HEIGHT = 45;

// export const DEFAULT_BACKGROUND_COLOR = '#121212';

/**
 * milliseconds to wait before turn off the copy link message
 */
export const COPIED_LINK_MESSAGE_TIME_TO_STAY_OPEN_IN_MILLISECONDS = 3000;

export const IS_MOBILE = isMobileDevice();

/**
 * Color for world imagery updates layer based on the status of the update
 */
export const WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS = {
    pending: {
        color: 'rgba(54, 218, 67, 1)',
        fill: 'rgba(54, 218, 67, .5)',
        fillColorArray: [54, 218, 67, 255],
        outline: 'rgba(54, 218, 67, .9)',
    },
    published: {
        color: 'rgba(255, 201, 0, 1)',
        fill: 'rgba(255, 201, 0, .5)',
        fillColorArray: [255, 201, 0, 255],
        outline: 'rgba(255, 201, 0, .9)',
    },
};
