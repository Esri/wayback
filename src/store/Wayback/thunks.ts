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

import { StoreDispatch, StoreGetState } from '../configureStore';
import {
    isLoadingWaybackItemsToggled,
    localChangesQueryDurationMsUpdated,
    releaseNum4ItemsWithLocalChangesUpdated,
} from './reducer';
import { getWaybackItemsWithLocalChanges } from '@esri/wayback-core';
import { logger } from '@utils/IndexedDBLogger';

let abortController: AbortController = null;

// Temporarily add this flag to URL to only use size to filter duplicates, which is a more aggressive way to filter duplicates and can significantly reduce the number of wayback items with local changes, thus improving the performance of querying local changes. This is a temporary solution until we have a better way to filter duplicates without relying on size, which can be inaccurate in some cases (e.g., when the image is resized or compressed).
const ONLY_USE_SIZE_TO_FILTER_DUPLICATES = window.location.search.includes(
    'onlyUseSizeToFilterDuplicates=true'
);

export const queryLocalChanges =
    ({
        longitude,
        latitude,
        zoom,
    }: {
        longitude: number;
        latitude: number;
        zoom: number;
    }) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        try {
            if (abortController) {
                abortController.abort();
            }

            abortController = new AbortController();

            dispatch(isLoadingWaybackItemsToggled(true));

            // const now = performance.now();

            const waybackItems = await getWaybackItemsWithLocalChanges(
                {
                    longitude,
                    latitude,
                },
                zoom,
                {
                    signal: abortController.signal,
                    onlyUseSizeToFilterDuplicates:
                        ONLY_USE_SIZE_TO_FILTER_DUPLICATES,
                }
            );

            // // calculate elapsed time for getting local changes
            // const localChangesQueryDurationMs = performance.now() - now;

            // console.log(waybackItems);
            const rNums = waybackItems.map((d) => d.releaseNum);

            // console.log(rNums);
            dispatch(releaseNum4ItemsWithLocalChangesUpdated(rNums));

            dispatch(isLoadingWaybackItemsToggled(false));

            // dispatch(
            //     localChangesQueryDurationMsUpdated(localChangesQueryDurationMs)
            // );
        } catch (err) {
            console.log('Error querying local changes:', err);

            if (err.name === 'AbortError' || !err?.message) {
                // Ignore abort error
                return;
            }

            logger.log('error_querying_local_changes', {
                point: {
                    longitude: longitude,
                    latitude: latitude,
                },
                zoom,
                error: (err as Error).message,
            });
        }
    };
