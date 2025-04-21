import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import React, { FC, use, useEffect, useMemo, useRef } from 'react';
import { useAppSelector } from '@store/configureStore';
import { selectMapMode } from '@store/Map/reducer';
import { selectUpdatesModeCategory } from '@store/UpdatesMode/selectors';
import {
    COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL,
    VIVID_ADVANCED_FROM_MAXAR_URL,
    VIVID_STANDARD_FROM_MAXAR_URL,
} from '@services/world-imagery-updates/config';
import { useTranslation } from 'react-i18next';
import { useWorldImageryUpdatesLayerWhereClause } from './useQueryWhereClause';

type Props = {
    mapView?: MapView;
};

export const WorldImageryUpdatesLayers: FC<Props> = ({ mapView }) => {
    const { t } = useTranslation();

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

    return null;
};
