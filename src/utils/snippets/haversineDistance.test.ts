/* Copyright 2024-2026 Esri
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

import { haversineDistance } from './haversineDistance';

describe('haversineDistance', () => {
    describe('edge cases', () => {
        it('should return 0 when point1 is null', () => {
            const point2 = { lat: 40.7128, lon: -74.006 };
            expect(haversineDistance(null as any, point2)).toBe(0);
        });

        it('should return 0 when point2 is null', () => {
            const point1 = { lat: 40.7128, lon: -74.006 };
            expect(haversineDistance(point1, null as any)).toBe(0);
        });

        it('should return 0 when both points are null', () => {
            expect(haversineDistance(null as any, null as any)).toBe(0);
        });

        it('should return 0 when point1 is undefined', () => {
            const point2 = { lat: 40.7128, lon: -74.006 };
            expect(haversineDistance(undefined as any, point2)).toBe(0);
        });

        it('should return 0 when point2 is undefined', () => {
            const point1 = { lat: 40.7128, lon: -74.006 };
            expect(haversineDistance(point1, undefined as any)).toBe(0);
        });

        it('should return 0 when both points are the same', () => {
            const point = { lat: 40.7128, lon: -74.006 };
            expect(haversineDistance(point, point)).toBe(0);
        });

        it('should return 0 when points have same coordinates', () => {
            const point1 = { lat: 40.7128, lon: -74.006 };
            const point2 = { lat: 40.7128, lon: -74.006 };
            expect(haversineDistance(point1, point2)).toBe(0);
        });
    });

    describe('distance calculations', () => {
        it('should calculate distance between New York and Los Angeles correctly', () => {
            const newYork = { lat: 40.7128, lon: -74.006 };
            const losAngeles = { lat: 34.0522, lon: -118.2437 };
            const distance = haversineDistance(newYork, losAngeles);

            // Expected distance is approximately 3936 km
            expect(distance).toBeGreaterThan(3930);
            expect(distance).toBeLessThan(3945);
        });

        it('should calculate distance between London and Paris correctly', () => {
            const london = { lat: 51.5074, lon: -0.1278 };
            const paris = { lat: 48.8566, lon: 2.3522 };
            const distance = haversineDistance(london, paris);

            // Expected distance is approximately 344 km
            expect(distance).toBeGreaterThan(340);
            expect(distance).toBeLessThan(350);
        });

        it('should calculate distance between Sydney and Tokyo correctly', () => {
            const sydney = { lat: -33.8688, lon: 151.2093 };
            const tokyo = { lat: 35.6762, lon: 139.6503 };
            const distance = haversineDistance(sydney, tokyo);

            // Expected distance is approximately 7823 km
            expect(distance).toBeGreaterThan(7800);
            expect(distance).toBeLessThan(7850);
        });

        it('should calculate small distances accurately', () => {
            const point1 = { lat: 40.7128, lon: -74.006 };
            const point2 = { lat: 40.7138, lon: -74.007 }; // ~100m away
            const distance = haversineDistance(point1, point2);

            // Very small distance, should be less than 1 km
            expect(distance).toBeGreaterThan(0);
            expect(distance).toBeLessThan(1);
        });

        it('should calculate distance across the equator', () => {
            const northPoint = { lat: 10, lon: 0 };
            const southPoint = { lat: -10, lon: 0 };
            const distance = haversineDistance(northPoint, southPoint);

            // Expected distance is approximately 2223 km (20 degrees latitude)
            expect(distance).toBeGreaterThan(2200);
            expect(distance).toBeLessThan(2250);
        });

        it('should calculate distance along the equator', () => {
            const westPoint = { lat: 0, lon: 0 };
            const eastPoint = { lat: 0, lon: 10 };
            const distance = haversineDistance(westPoint, eastPoint);

            // Expected distance is approximately 1113 km (10 degrees longitude at equator)
            expect(distance).toBeGreaterThan(1100);
            expect(distance).toBeLessThan(1120);
        });

        it('should handle points with same latitude but different longitude', () => {
            const point1 = { lat: 45.0, lon: -90.0 };
            const point2 = { lat: 45.0, lon: -80.0 };
            const distance = haversineDistance(point1, point2);

            // Should be a positive distance
            expect(distance).toBeGreaterThan(0);
        });

        it('should handle points with same longitude but different latitude', () => {
            const point1 = { lat: 30.0, lon: -90.0 };
            const point2 = { lat: 40.0, lon: -90.0 };
            const distance = haversineDistance(point1, point2);

            // Should be a positive distance
            expect(distance).toBeGreaterThan(0);
        });

        it('should be symmetric (distance A to B equals distance B to A)', () => {
            const pointA = { lat: 40.7128, lon: -74.006 };
            const pointB = { lat: 34.0522, lon: -118.2437 };

            const distanceAtoB = haversineDistance(pointA, pointB);
            const distanceBtoA = haversineDistance(pointB, pointA);

            expect(distanceAtoB).toBe(distanceBtoA);
        });
    });

    describe('boundary conditions', () => {
        it('should handle points at the North Pole', () => {
            const northPole = { lat: 90, lon: 0 };
            const point = { lat: 45, lon: 0 };
            const distance = haversineDistance(northPole, point);

            // Should be approximately 5003 km (45 degrees of latitude)
            expect(distance).toBeGreaterThan(4900);
            expect(distance).toBeLessThan(5100);
        });

        it('should handle points at the South Pole', () => {
            const southPole = { lat: -90, lon: 0 };
            const point = { lat: -45, lon: 0 };
            const distance = haversineDistance(southPole, point);

            // Should be approximately 5003 km (45 degrees of latitude)
            expect(distance).toBeGreaterThan(4900);
            expect(distance).toBeLessThan(5100);
        });

        it('should handle points crossing the International Date Line', () => {
            const westPoint = { lat: 0, lon: 179 };
            const eastPoint = { lat: 0, lon: -179 };
            const distance = haversineDistance(westPoint, eastPoint);

            // Should calculate the shorter path (about 2 degrees, ~222 km)
            expect(distance).toBeGreaterThan(200);
            expect(distance).toBeLessThan(250);
        });

        it('should handle zero latitude and longitude', () => {
            const origin = { lat: 0, lon: 0 };
            const point = { lat: 1, lon: 1 };
            const distance = haversineDistance(origin, point);

            // Should be a positive distance
            expect(distance).toBeGreaterThan(0);
            expect(distance).toBeLessThan(200);
        });
    });
});
