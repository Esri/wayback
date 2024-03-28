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

import { Extent } from '@arcgis/core/geometry';

/**
 * Returns an Extent that's been shifted to within +/- 180.
 * The map view's extent can go out of range after the user drags the map
 * across the international date line.
 *
 * Therefore, normalizing the Extent is essential to ensure the coordinates are within the
 * correct range. This function takes an Extent object as input and shifts it to ensure
 * corrdinate values are within the range of -180 to +180 degrees (or equivelant projected values).
 *
 * @param extent - The Extent object representing the geographic area.
 * @returns {Extent} - The normalized Extent object with longitude values within the range of +/- 180 degrees.
 */
export const getNormalizedExtent = (extent: Extent): Extent => {
    return extent.clone().normalize()[0];
};
