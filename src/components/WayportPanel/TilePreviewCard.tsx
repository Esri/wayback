import React, { FC, useEffect, useMemo } from 'react';
import { SliderHandleType } from './Slider';
import { useAppSelector } from '@store/configureStore';
import { selectMapCenterAndZoom } from '@store/Map/reducer';
import { getWaybackServiceBaseURL } from '@esri/wayback-core';
import { geometryFns } from 'helper-toolkit-ts';
import { set } from 'date-fns';
import { se } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type PreviewCardProps = {
    handleOnDragging: SliderHandleType;
    levels: number[] | null;
    maxAvailableTileLevel: number;
    releaseNumOfActiveWaybackItem: number;
};

export const TilePreviewCard: FC<PreviewCardProps> = ({
    handleOnDragging,
    levels,
    maxAvailableTileLevel,
    releaseNumOfActiveWaybackItem,
}) => {
    const { t } = useTranslation();

    const hidden = !handleOnDragging || !levels || levels?.length === 0;

    const mapCenterAndZoom = useAppSelector(selectMapCenterAndZoom);

    const [imageUrlsByLevel, setImageUrlsByLevel] = React.useState<{
        [level: number]: string;
    }>({});

    const [previewImageURL, setPreviewImageURL] = React.useState<string>('');

    useEffect(() => {
        if (!handleOnDragging || !levels || levels.length === 0) {
            setPreviewImageURL('');
            return;
        }

        const level = handleOnDragging === 'min' ? levels[0] : levels[1];
        setPreviewImageURL(imageUrlsByLevel[level] || '');
    }, [handleOnDragging, levels, imageUrlsByLevel]);

    const loadPreviewImages = ({
        latitude,
        longitude,
        releaseNum,
        maxAvailableTileLevel,
    }: {
        latitude: number;
        longitude: number;
        releaseNum: number;
        maxAvailableTileLevel: number;
    }) => {
        const imageURLs: string[] = [];

        const urlsByLevel: { [level: number]: string } = {};

        const baseURL = getWaybackServiceBaseURL();

        for (let level = 1; level <= maxAvailableTileLevel; level++) {
            const tileRow = geometryFns.lat2tile(latitude, level);
            const tileCol = geometryFns.long2tile(longitude, level);
            const imageURL = `${baseURL}/tile/${releaseNum}/${level}/${tileRow}/${tileCol}`;
            imageURLs.push(imageURL);
            urlsByLevel[level] = imageURL;
        }

        // pre-fetch the preview images for all zoom levels so that when user drags the slider to change the zoom level, the corresponding preview image can be shown immediately without waiting for the image to be fetched
        for (const imageURL of imageURLs) {
            const img = new Image();
            img.src = imageURL;
        }

        setImageUrlsByLevel(urlsByLevel);

        // console.log('Loading preview images for levels: ', levels);
    };

    useEffect(() => {
        // console.log('mapCenterAndZoom in TilePreviewCard', mapCenterAndZoom);
        const { center } = mapCenterAndZoom || {};

        if (
            !center ||
            isNaN(center?.lat) ||
            isNaN(center?.lon) ||
            !releaseNumOfActiveWaybackItem
        ) {
            setImageUrlsByLevel({});
            return;
        }

        // console.log('Updating TilePreviewCard with map center: ', center);
        loadPreviewImages({
            latitude: center?.lat,
            longitude: center?.lon,
            releaseNum: releaseNumOfActiveWaybackItem,
            maxAvailableTileLevel,
        });
    }, [
        mapCenterAndZoom,
        releaseNumOfActiveWaybackItem,
        maxAvailableTileLevel,
    ]);

    if (hidden) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-[130px] bg-black bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
            {previewImageURL ? (
                <img
                    src={previewImageURL}
                    alt="Tile Preview"
                    className="max-w-full max-h-full object-contain"
                />
            ) : (
                <span className="text-white text-sm">
                    {t('tile_not_available_message', {
                        zoomLevel:
                            handleOnDragging === 'min' ? levels[0] : levels[1],
                    })}
                </span>
            )}
        </div>
    );
};
