import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import React, { FC, use, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { selectMapMode } from '@store/Map/reducer';
import { selectUpdatesModeCategory } from '@store/UpdatesMode/selectors';
import {
    COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL,
    VIVID_ADVANCED_FROM_MAXAR_URL,
    VIVID_STANDARD_FROM_MAXAR_URL,
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import { useTranslation } from 'react-i18next';
import { useWorldImageryUpdatesLayerWhereClause } from './useQueryWhereClause';
import { WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS } from '@constants/UI';
import { worldImageryUpdatesOutStatisticsChanged } from '@store/UpdatesMode/reducer';

type Props = {
    mapView?: MapView;
};

export const WorldImageryUpdatesLayers: FC<Props> = ({ mapView }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const worldImageryUpdatesLayerRef = useRef<FeatureLayer>(null);

    const mode = useAppSelector(selectMapMode);

    const catgegory = useAppSelector(selectUpdatesModeCategory);

    const isVisible = useMemo(() => {
        return mode === 'updates';
    }, [mode]);

    const layerURL = useMemo(() => {
        if (catgegory === 'vivid-advanced') {
            return VIVID_ADVANCED_FROM_MAXAR_URL;
        }

        if (catgegory === 'vivid-standard') {
            return VIVID_STANDARD_FROM_MAXAR_URL;
        }

        if (catgegory === 'community-contributed') {
            return COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL;
        }

        return null;
    }, [catgegory]);

    const whereClause = useWorldImageryUpdatesLayerWhereClause();

    useEffect(() => {
        if (!mapView || !layerURL) return;

        if (worldImageryUpdatesLayerRef.current) {
            mapView.map.remove(worldImageryUpdatesLayerRef.current);
        }

        const worldImageryUpdatesLayer = new FeatureLayer({
            url: layerURL,
            title: t('world_imagery_updates'),
            visible: isVisible,
            popupTemplate: {
                title: t('world_imagery_updates_popup_title'),
                content: `
                <div class="text-white">
                <p>${t('world_imagery_updates_popup_content')}</p>
                </div>
            `,
            },
            definitionExpression: whereClause,
            renderer: {
                type: 'unique-value',
                field: WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE,
                uniqueValueInfos: [
                    {
                        value: WorldImageryUpdatesStatusEnum.published,
                        label: WorldImageryUpdatesStatusEnum.published,
                        symbol: {
                            color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                .published.fill, // Converted to RGB
                            type: 'simple-fill',
                            style: 'solid',
                            outline: {
                                type: 'simple-line',
                                color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                    .published.outline,
                                width: '3px',
                                style: 'solid',
                            },
                        },
                    },
                    {
                        value: WorldImageryUpdatesStatusEnum.pending,
                        label: WorldImageryUpdatesStatusEnum.pending,
                        symbol: {
                            color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                .pending.fill, // Converted to RGB
                            type: 'simple-fill',
                            style: 'solid',
                            outline: {
                                type: 'simple-line',
                                color: WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                    .pending.outline,
                                width: '3px',
                                style: 'solid',
                            },
                        },
                    },
                ],
            },
            effect: 'drop-shadow(0px 0px 5px #000)',
        });

        worldImageryUpdatesLayerRef.current = worldImageryUpdatesLayer;

        mapView.map.add(worldImageryUpdatesLayer);
    }, [mapView, layerURL]);

    useEffect(() => {
        if (!worldImageryUpdatesLayerRef.current) return;

        worldImageryUpdatesLayerRef.current.visible = isVisible;
    }, [isVisible]);

    useEffect(() => {
        if (!worldImageryUpdatesLayerRef.current) return;

        worldImageryUpdatesLayerRef.current.definitionExpression = whereClause;
    }, [whereClause]);

    useEffect(() => {
        if (!worldImageryUpdatesLayerRef.current) {
            return;
        }

        const outStatisticFieldName4Count = 'totalCount';
        const outStatisticFieldName4Area = 'totalArea';

        // query the features in the world imagery updates layer to get the count and area of pending and published updates
        // that meet the where clause
        worldImageryUpdatesLayerRef.current
            .queryFeatures({
                where: whereClause,
                returnGeometry: false,
                // outFields: [
                //     WORLD_IMAGERY_UPDATES_LAYER_FIELDS.AREA_SQKM,
                //     WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE,
                // ],
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
                // console.log('result:', result);

                let countOfPending = 0;
                let countOfPublished = 0;
                let areaOfPending = 0;
                let areaOfPublished = 0;

                for (const feature of features) {
                    const pubState =
                        feature.attributes[
                            WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE
                        ];
                    // console.log(`Area: ${area}, PubState: ${pubState}`);

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

                // console.log('Count of Pending:', countOfPending);
                // console.log('Count of Published:', countOfPublished);
                // console.log('Area of Pending:', areaOfPending);
                // console.log('Area of Published:', areaOfPublished);

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

    return null;
};
