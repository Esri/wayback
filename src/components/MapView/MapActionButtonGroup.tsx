import classNames from 'classnames';
import React, { FC } from 'react';
import MapView from '@arcgis/core/views/MapView';
import { ZoomToExtent } from '@components/ZoomToExtent/ZoomToExtent';
import { useTranslation } from 'react-i18next';
import { CopyLink } from '@components/CopyLink/CopyLink';

type Props = {
    mapView?: MapView;
    // children?: React.ReactNode;
};

/**
 * This component groups custom Map Action Buttons together at the left side of the map container
 */
export const MapActionButtonGroup: FC<Props> = ({ mapView }) => {
    const { t } = useTranslation();

    if (!mapView) {
        return null;
    }

    return (
        <div className={classNames('absolute left-4 top-[116px] z-10 ')}>
            <ZoomToExtent
                tooltip={t('zoom_to_full_extent')}
                onClick={() => {
                    mapView.zoom = 3;
                }}
            />

            <CopyLink />
        </div>
    );
};
