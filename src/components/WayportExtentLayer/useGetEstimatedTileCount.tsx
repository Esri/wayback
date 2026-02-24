import {
    getTileEstimationsInOutputBundle,
    TileEstimation,
} from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import { DownloadJob } from '@store/DownloadMode/reducer';
import { DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB } from '@store/DownloadMode/thunks';
import { IExtent } from '@typings/index';
import React from 'react';

type Props = {
    job: DownloadJob;
    extent: IExtent;
};

type TileEstimationData = {
    tileEstimations: TileEstimation[] | null;
    minLevel: number | null;
    maxLevel: number | null;
};

export const useGetTileEstimations = ({ job, extent }: Props) => {
    const [tileEstimationOutput, setTileEstimationOutput] =
        React.useState<TileEstimationData>({
            tileEstimations: null,
            minLevel: null,
            maxLevel: null,
        });

    const [isGettingEstimations, setIsGettingEstimations] =
        React.useState(false);

    const getTileEstimations = async () => {
        if (!job || !extent) return;

        setIsGettingEstimations(true);

        try {
            const tileEstimations = await getTileEstimationsInOutputBundle(
                extent,
                DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
                job.waybackItem.releaseNum
            );

            const minZoomLevel = DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB;
            const maxZoomLevel =
                tileEstimations[tileEstimations.length - 1].level;

            setTileEstimationOutput({
                tileEstimations,
                minLevel: minZoomLevel,
                maxLevel: maxZoomLevel,
            });
        } catch (error) {
            console.error('Error getting tile estimations:', error);
            setTileEstimationOutput({
                tileEstimations: null,
                minLevel: null,
                maxLevel: null,
            });
        } finally {
            setIsGettingEstimations(false);
        }
    };

    React.useEffect(() => {
        if (!job || !extent) {
            setTileEstimationOutput({
                tileEstimations: null,
                minLevel: null,
                maxLevel: null,
            });
            return;
        }

        getTileEstimations();
    }, [job, extent]);

    return {
        tileEstimationData: tileEstimationOutput,
        isGettingEstimations,
    };
};
