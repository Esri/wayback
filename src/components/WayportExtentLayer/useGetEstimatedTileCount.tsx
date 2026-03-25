import {
    getTileEstimationsInOutputBundle,
    TileEstimation,
} from '@services/wayport/getTileEstimationsInOutputBundle';
import { DownloadJob } from '@store/DownloadMode/reducer';
import { DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB } from '@store/DownloadMode/thunks';
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
};

/**
 * This hook is used to get the estimations of number of tiles that can be included in the output bundle based on the user selected extent and release number of the wayback item.
 * The estimation will be used to help users make decision on whether to adjust the extent or zoom levels for the download job.
 * @param params.releaseNum release number of the wayback item associated with the download job
 * @param params.extent user selected extent for the download job
 * @returns an array of tile estimation by zoom level and a boolean indicating whether the estimation is being fetched
 */
export const useGetTileEstimations = ({ releaseNum, extent }: Props) => {
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
        if (!releaseNum || !extent) {
            setTileEstimations(null);
            return;
        }

        getTileEstimations();
    }, [releaseNum, extent]);

    return {
        tileEstimations,
        isGettingEstimations,
    };
};
