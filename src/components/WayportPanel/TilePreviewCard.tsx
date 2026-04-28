/* Copyright 2024-2026 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
