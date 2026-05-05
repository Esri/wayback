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

import {
    getTileEstimationsInOutputBundle,
    TileEstimation,
} from '@services/wayport/getTileEstimationsInOutputBundle';
import { DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB } from '@store/WayportMode/thunks';
import { IExtent } from '@typings/index';
import React, { useMemo } from 'react';

type Props = {
    /**
     * release number of the wayback item associated with the download job
     */
    releaseNum: number;
    /**
     * user selected extent for the download job
     */
    extent: IExtent;
    /**
     * If true, the tile estimation will not be fetched and the hook will return null. This is used to prevent fetching tile estimation when user is not signed in, as the estimation is not needed and the API requires authentication.
     */
    isCreateExportJobDisabled: boolean;
};

/**
 * This hook is used to get the estimations of number of tiles that can be included in the output bundle based on the user selected extent and release number of the wayback item.
 * The estimation will be used to help users make decision on whether to adjust the extent or zoom levels for the download job.
 * @param params.releaseNum release number of the wayback item associated with the download job
 * @param params.extent user selected extent for the download job
 * @returns an array of tile estimation by zoom level and a boolean indicating whether the estimation is being fetched
 */
export const useGetTileEstimations = ({
    releaseNum,
    extent,
    isCreateExportJobDisabled,
}: Props) => {
    const [tileEstimations, setTileEstimations] =
        React.useState<TileEstimation[]>(null);

    const [isGettingEstimations, setIsGettingEstimations] =
        React.useState(false);

    const getTileEstimations = async () => {
        if (!releaseNum || !extent) return;

        setIsGettingEstimations(true);

        try {
            const tileEstimations = await getTileEstimationsInOutputBundle(
                extent,
                DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
                releaseNum
            );

            setTileEstimations(tileEstimations);
        } catch (error) {
            console.error('Error getting tile estimations:', error);
            setTileEstimations(null);
        } finally {
            setIsGettingEstimations(false);
        }
    };

    React.useEffect(() => {
        if (!releaseNum || !extent || isCreateExportJobDisabled) {
            setTileEstimations(null);
            return;
        }

        getTileEstimations();
    }, [releaseNum, extent, isCreateExportJobDisabled]);

    return {
        tileEstimations,
        isGettingEstimations,
    };
};
