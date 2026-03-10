import React, { FC } from 'react';
import { SliderHandleType } from './Slider';

type PreviewCardProps = {
    handleOnDragging: SliderHandleType;
    levels: number[] | null;
};

export const TilePreviewCard: FC<PreviewCardProps> = ({
    handleOnDragging,
    levels,
}) => {
    if (!handleOnDragging || !levels || levels?.length === 0) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-[130px] bg-black bg-opacity-70 backdrop-blur-sm z-10"></div>
    );
};
