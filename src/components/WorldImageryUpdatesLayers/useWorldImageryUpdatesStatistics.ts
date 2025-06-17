import { useEffect } from 'react';
import { useAppDispatch } from '@store/configureStore';
import { worldImageryUpdatesOutStatisticsChanged } from '@store/UpdatesMode/reducer';
import {
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

/**
 * Custom hook to query and process statistics for the World Imagery Updates layer.
 *
 * This hook performs a query on the provided `worldImageryUpdatesLayerRef` to retrieve
 * statistics such as the total count and area of features grouped by their publication state.
 * The results are then dispatched to the Redux store using the `worldImageryUpdatesOutStatisticsChanged` action.
 *
 * @param worldImageryUpdatesLayerRef - A React ref object pointing to the FeatureLayer instance
 *                                      representing the World Imagery Updates layer.
 * @param whereClause - A SQL-like where clause string used to filter the features in the query.
 *
 * @remarks
 * - The query retrieves two statistics: the sum of the area (`AREA_SQKM`) and the count of features (`OBJECTID`).
 * - The results are grouped by the `PUB_STATE` field, which indicates the publication state of the features.
 * - The hook updates the Redux store with the counts and areas for both "pending" and "published" states.
 *
 * @example
 * ```tsx
 * const worldImageryUpdatesLayerRef = useRef<FeatureLayer>(null);
 * const whereClause = "PUB_STATE IN ('pending', 'published')";
 *
 * useWorldImageryUpdatesStatistics(worldImageryUpdatesLayerRef, whereClause);
 * ```
 *
 * @throws Will log an error to the console if the query fails.
 */
export const useWorldImageryUpdatesStatistics = (
    worldImageryUpdatesLayerRef: React.RefObject<FeatureLayer>,
    layerURL: string,
    whereClause: string
) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!worldImageryUpdatesLayerRef.current) {
            return;
        }

        const outStatisticFieldName4Count = 'totalCount';
        const outStatisticFieldName4Area = 'totalArea';

        worldImageryUpdatesLayerRef.current
            .queryFeatures({
                where: whereClause,
                returnGeometry: false,
                outStatistics: [
                    {
                        statisticType: 'sum',
                        onStatisticField:
                            WORLD_IMAGERY_UPDATES_LAYER_FIELDS.AREA_SQKM,
                        outStatisticFieldName: outStatisticFieldName4Area,
                    },
                    {
                        statisticType: 'count',
                        onStatisticField:
                            WORLD_IMAGERY_UPDATES_LAYER_FIELDS.OBJECTID,
                        outStatisticFieldName: outStatisticFieldName4Count,
                    },
                ],
                groupByFieldsForStatistics: [
                    WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE,
                ],
                cacheHint: true,
            })
            .then((result) => {
                const features = result.features;

                let countOfPending = 0;
                let countOfPublished = 0;
                let areaOfPending = 0;
                let areaOfPublished = 0;

                for (const feature of features) {
                    const pubState =
                        feature.attributes[
                            WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE
                        ];

                    if (pubState === WorldImageryUpdatesStatusEnum.pending) {
                        countOfPending =
                            feature.attributes[outStatisticFieldName4Count];
                        areaOfPending =
                            feature.attributes[outStatisticFieldName4Area];
                    } else if (
                        pubState === WorldImageryUpdatesStatusEnum.published
                    ) {
                        countOfPublished =
                            feature.attributes[outStatisticFieldName4Count];
                        areaOfPublished =
                            feature.attributes[outStatisticFieldName4Area];
                    }
                }

                dispatch(
                    worldImageryUpdatesOutStatisticsChanged({
                        countOfPending,
                        countOfPublished,
                        areaOfPending,
                        areaOfPublished,
                    })
                );
            })
            .catch((error) => {
                console.error('Error querying features:', error);
            });
    }, [whereClause, layerURL]);
};
