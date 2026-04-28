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

import { useWorldImageryUpdatesLayerWhereClause } from '@components/WorldImageryUpdatesLayers/useWorldImageryUpdatesLayerWhereClause';
import { useAsync } from '@hooks/useAsync';
import { getListOfCountries } from '@services/world-imagery-updates/getListOfCountries';
import { useAppSelector } from '@store/configureStore';
import { selectUpdatesModeCategory } from '@store/UpdatesMode/selectors';
import { isAnonymouns } from '@utils/Esri-OAuth';
import { logger } from '@utils/IndexedDBLogger';
import React, { useEffect } from 'react';

export const useListOfRegions = () => {
    const category = useAppSelector(selectUpdatesModeCategory);

    const [listOfRegions, setListOfRegions] = React.useState<string[]>([]);

    const { isLoading, error, execute } = useAsync(getListOfCountries);

    // get the where clause for the world imagery updates layer
    // but ignore the region filter. This where clause is used to fetch the list of regions
    // that match the selected category and other filters
    const whereClause = useWorldImageryUpdatesLayerWhereClause(true);

    useEffect(() => {
        (async () => {
            try {
                if (isAnonymouns()) {
                    // setListOfRegions([]);
                    console.warn('Skipping fetch of regions.');
                    return;
                }

                // console.log('Fetching list of regions for category:', category);
                const regions = await execute(category, whereClause);
                // console.log('Fetched regions:', regions);
                setListOfRegions(regions);
            } catch (e) {
                console.error('Error fetching list of regions:', e);

                logger.log('error_fetching_list_of_regions', {
                    category,
                    whereClause,
                    error: (e as Error).message,
                });

                setListOfRegions([]);
            }
        })();
    }, [category, whereClause]);

    return {
        listOfRegions,
        isLoading,
        error,
    };
};
