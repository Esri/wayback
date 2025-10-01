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

import { Point } from '@arcgis/core/geometry';
import { StoreDispatch, StoreGetState } from '../configureStore';
import {
    isLoadingWaybackItemsToggled,
    releaseNum4ItemsWithLocalChangesUpdated,
} from './reducer';
import { getWaybackItemsWithLocalChanges } from '@esri/wayback-core';
import { logger } from '@utils/IndexedDBLogger';

let abortController: AbortController = null;

export const queryLocalChanges =
    (point: Point, zoom: number) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        try {
            if (abortController) {
                abortController.abort();
            }

            abortController = new AbortController();

            dispatch(isLoadingWaybackItemsToggled(true));

            const waybackItems = await getWaybackItemsWithLocalChanges(
                {
                    longitude: point.longitude,
                    latitude: point.latitude,
                },
                zoom,
                abortController
            );

            // console.log(waybackItems);

            const rNums = waybackItems.map((d) => d.releaseNum);

            // console.log(rNums);
            dispatch(releaseNum4ItemsWithLocalChangesUpdated(rNums));

            dispatch(isLoadingWaybackItemsToggled(false));
        } catch (err) {
            console.log('Error querying local changes:', err);

            if (err.name === 'AbortError' || !err?.message) {
                // Ignore abort error
                return;
            }

            logger.log('error_querying_local_changes', {
                point: {
                    longitude: point.longitude,
                    latitude: point.latitude,
                },
                zoom,
                error: (err as Error).message,
            });
        }
    };
