import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { indexOfCurrentAnimationFrameSelector } from '@store/AnimationMode/reducer';

import { FrameData } from './generateFrames4GIF';

type Props = {
    frameData: FrameData[];
};

const ImageAutoPlay: React.FC<Props> = ({ frameData }: Props) => {
    const idx = useSelector(indexOfCurrentAnimationFrameSelector);

    // const isPlaying = useSelector(isAnimationPlayingSelector)

    const getCurrentFrame = () => {
        if (!frameData || !frameData.length) {
            return null;
        }

        const { frameDataURI } = frameData[idx] || frameData[0];

        return (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: `url(${frameDataURI})`,
                    boxSizing: 'border-box',
                }}
            ></div>
        );
    };

    return getCurrentFrame();
};

export default ImageAutoPlay;
