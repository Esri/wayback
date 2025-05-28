import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import React, { FC, use, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { selectMapMode } from '@store/Map/reducer';
import {
    selectUpdatesModeCategory,
    selectUpdatesModeRegion,
} from '@store/UpdatesMode/selectors';
import {
    COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL,
    VIVID_ADVANCED_FROM_MAXAR_URL,
    VIVID_STANDARD_FROM_MAXAR_URL,
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import { useTranslation } from 'react-i18next';
import { useWorldImageryUpdatesLayerWhereClause } from './useWorldImageryUpdatesLayerWhereClause';
import { WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS } from '@constants/UI';
import { worldImageryUpdatesOutStatisticsChanged } from '@store/UpdatesMode/reducer';
import {
    getPopupTemplate,
    getUniqueValueRenderer4WorldImageryUpdates,
} from './helpers';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import { useWorldImageryUpdatesStatistics } from './useWorldImageryUpdatesStatistics';
import { useZoomToSelectedRegion } from './useZoomToSelectedRegion';

type Props = {
    mapView?: MapView;
};

export const WorldImageryUpdatesLayers: FC<Props> = ({ mapView }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const groupLayerRef = useRef<GroupLayer>(null);

    const worldImageryUpdatesLayerRef = useRef<FeatureLayer>(null);

    const worldImageryUpdatesLayer4InnerGlowPatternsRef =
        useRef<FeatureLayer>(null);

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

    const selectedRegion = useAppSelector(selectUpdatesModeRegion);

    const whereClause = useWorldImageryUpdatesLayerWhereClause();

    useEffect(() => {
        if (!mapView || !layerURL || mode !== 'updates') return;

        // if the group layer is not created yet, create it and add it to the map
        if (!groupLayerRef.current) {
            const groupLayer = new GroupLayer({
                effect: 'drop-shadow(0px 0px 5px #000)',
            });
            groupLayerRef.current = groupLayer;
            mapView.map.add(groupLayer);
        }

        if (worldImageryUpdatesLayerRef.current) {
            groupLayerRef.current.removeAll();
        }

        worldImageryUpdatesLayerRef.current = new FeatureLayer({
            url: layerURL,
            title: t('world_imagery_updates'),
            visible: isVisible,
            definitionExpression: whereClause,
            popupTemplate: getPopupTemplate(catgegory),
            renderer: getUniqueValueRenderer4WorldImageryUpdates(),
            // effect: 'drop-shadow(0px 0px 5px #000)',
        });

        /**
         * This layer is used for rendering inner glow patterns
         * in the world imagery updates visualization.
         *
         * @see https://www.esri.com/arcgis-blog/products/arcgis-online/mapping/inner-glow-patterns-for-polygons-in-arcgis-online
         */
        worldImageryUpdatesLayer4InnerGlowPatternsRef.current =
            new FeatureLayer({
                url: layerURL,
                title: t('world_imagery_updates'),
                visible: isVisible,
                definitionExpression: whereClause,
                blendMode: 'destination-in',
                effect: 'blur(10px)',
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'simple-fill',
                        color: [0, 0, 0, 0],
                        outline: {
                            color: [0, 0, 0, 255],
                            width: 14,
                        },
                    },
                },
            });

        groupLayerRef.current.addMany([
            worldImageryUpdatesLayerRef.current,
            worldImageryUpdatesLayer4InnerGlowPatternsRef.current,
        ]);
    }, [mapView, layerURL, mode]);

    useEffect(() => {
        if (!groupLayerRef.current) return;

        groupLayerRef.current.visible = isVisible;
    }, [isVisible]);

    useEffect(() => {
        if (!worldImageryUpdatesLayerRef.current) return;

        worldImageryUpdatesLayerRef.current.definitionExpression = whereClause;
        worldImageryUpdatesLayer4InnerGlowPatternsRef.current.definitionExpression =
            whereClause;
    }, [whereClause]);

    useWorldImageryUpdatesStatistics(
        worldImageryUpdatesLayerRef,
        layerURL,
        whereClause
    );

    useZoomToSelectedRegion(
        worldImageryUpdatesLayerRef,
        selectedRegion,
        whereClause,
        mapView
    );

    // useEffect(() => {
    //     if (!worldImageryUpdatesLayerRef.current) {
    //         return;
    //     }

    //     const outStatisticFieldName4Count = 'totalCount';
    //     const outStatisticFieldName4Area = 'totalArea';

    //     // query the features in the world imagery updates layer to get the count and area of pending and published updates
    //     // that meet the where clause
    //     worldImageryUpdatesLayerRef.current
    //         .queryFeatures({
    //             where: whereClause,
    //             returnGeometry: false,
    //             // outFields: [
    //             //     WORLD_IMAGERY_UPDATES_LAYER_FIELDS.AREA_SQKM,
    //             //     WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE,
    //             // ],
    //             outStatistics: [
    //                 {
    //                     statisticType: 'sum',
    //                     onStatisticField:
    //                         WORLD_IMAGERY_UPDATES_LAYER_FIELDS.AREA_SQKM,
    //                     outStatisticFieldName: outStatisticFieldName4Area,
    //                 },
    //                 {
    //                     statisticType: 'count',
    //                     onStatisticField:
    //                         WORLD_IMAGERY_UPDATES_LAYER_FIELDS.OBJECTID,
    //                     outStatisticFieldName: outStatisticFieldName4Count,
    //                 },
    //             ],
    //             groupByFieldsForStatistics: [
    //                 WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE,
    //             ],
    //             cacheHint: true,
    //         })
    //         .then((result) => {
    //             const features = result.features;
    //             // console.log('result:', result);

    //             let countOfPending = 0;
    //             let countOfPublished = 0;
    //             let areaOfPending = 0;
    //             let areaOfPublished = 0;

    //             for (const feature of features) {
    //                 const pubState =
    //                     feature.attributes[
    //                         WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE
    //                     ];
    //                 // console.log(`Area: ${area}, PubState: ${pubState}`);

    //                 if (pubState === WorldImageryUpdatesStatusEnum.pending) {
    //                     countOfPending =
    //                         feature.attributes[outStatisticFieldName4Count];
    //                     areaOfPending =
    //                         feature.attributes[outStatisticFieldName4Area];
    //                 } else if (
    //                     pubState === WorldImageryUpdatesStatusEnum.published
    //                 ) {
    //                     countOfPublished =
    //                         feature.attributes[outStatisticFieldName4Count];
    //                     areaOfPublished =
    //                         feature.attributes[outStatisticFieldName4Area];
    //                 }
    //             }

    //             // console.log('Count of Pending:', countOfPending);
    //             // console.log('Count of Published:', countOfPublished);
    //             // console.log('Area of Pending:', areaOfPending);
    //             // console.log('Area of Published:', areaOfPublished);

    //             dispatch(
    //                 worldImageryUpdatesOutStatisticsChanged({
    //                     countOfPending,
    //                     countOfPublished,
    //                     areaOfPending,
    //                     areaOfPublished,
    //                 })
    //             );
    //         })
    //         .catch((error) => {
    //             console.error('Error querying features:', error);
    //         });
    // }, [whereClause, layerURL]);

    return null;
};
