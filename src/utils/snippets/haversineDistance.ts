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

type Point = { lat: number; lon: number };

/**
 * Calculates the great-circle distance between two points using the Haversine formula.
 *
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 * @see https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
 */
export const haversineDistance = (point1: Point, point2: Point): number => {
    if (!point1 || !point2) {
        return 0;
    }

    if (point1.lat === point2.lat && point1.lon === point2.lon) {
        return 0;
    }

    const EARTH_RADIUS_KM = 6371;

    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lon - point1.lon);

    const lat1 = toRad(point1.lat);
    const lat2 = toRad(point2.lat);

    const sDLat = Math.sin(dLat / 2);
    const sDLon = Math.sin(dLon / 2);

    const a = sDLat * sDLat + Math.cos(lat1) * Math.cos(lat2) * sDLon * sDLon;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
};
