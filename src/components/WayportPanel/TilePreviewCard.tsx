import React, { FC, useEffect, useMemo } from 'react';
import { SliderHandleType } from './Slider';
import { getPreviewImageURLs } from './jobCardHelpers';

type PreviewCardProps = {
    handleOnDragging: SliderHandleType;
    levels: number[] | null;
};

export const TilePreviewCard: FC<PreviewCardProps> = ({
    handleOnDragging,
    levels,
}) => {
    const hidden = !handleOnDragging || !levels || levels?.length === 0;

    const [levelToPreview, setLevelToPreview] = React.useState<number | null>(
        null
    );

    const previewImages = useMemo(() => {
        // console.log('Preview images by zoom level: ', previewImages);
        return getPreviewImageURLs();
    }, []);

    const previewImageURL = useMemo(() => {
        if (!levelToPreview) {
            return null;
        }

        return previewImages[levelToPreview] || null;
    }, [levelToPreview]);

    useEffect(() => {
        if (!handleOnDragging || !levels || levels.length === 0) {
            setLevelToPreview(-1);
            return;
        }

        const level = handleOnDragging === 'min' ? levels[0] : levels[1];
        setLevelToPreview(level);
    }, [handleOnDragging, levels]);

    if (hidden) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full bottom-0 bg-[#2a2a2a] z-10 flex items-center justify-center">
            <img
                src={previewImageURL}
                alt="Tile Preview"
                className="max-w-full max-h-full object-contain"
            />
        </div>
    );
};
