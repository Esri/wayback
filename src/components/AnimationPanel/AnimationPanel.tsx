import React, { useRef, useEffect, useState } from 'react';

import MapView from '@arcgis/core/views/MapView';

import { generateFrames } from './generateFrames4GIF';

import Resizable from './Resizable';
import ImageAutoPlay from './ImageAutoPlay'

type Props = {
    releaseNums: number[]
    mapView?: MapView;
};

// import gifshot from 'gifshot';

type CreateGIFCallBack = (response: {
    // image - Base 64 image
    image: string;
    // error - Boolean that determines if an error occurred
    error: boolean;
    // errorCode - Helpful error label
    errorCode: string;
    // errorMsg - Helpful error message
    errorMsg: string;
}) => void;

type GetFramesParams = {
    releaseNums:number[], 
    container: HTMLDivElement, 
    mapView: MapView
}

// width of Gutter and Side Bar, need to calculate this dynamically
export const PARENT_CONTAINER_LEFT_OFFSET = 350;

const getFrames = async ({
    releaseNums, 
    container, 
    mapView
}:GetFramesParams):Promise<string[]> => {

    const elemRect = container.getBoundingClientRect();
    // console.log(elemRect)

    const { offsetHeight, offsetWidth } = container;

    const images = await generateFrames({
        frameRect: {
            screenX: elemRect.left - PARENT_CONTAINER_LEFT_OFFSET,
            screenY: elemRect.top,
            width: offsetWidth,
            height: offsetHeight,
        },
        mapView,
        releaseNums
    });

    return images;
};

const containerRef = React.createRef<HTMLDivElement>();

const AnimationPanel: React.FC<Props> = ({ releaseNums, mapView }: Props) => {

    // array of frame images as dataURI string 
    const [frames, setFrames] = useState<string[]>();

    useEffect(() => {
        (async()=>{
            if(releaseNums.length){

                const frames = await getFrames({
                    releaseNums,
                    container: containerRef.current,
                    mapView
                });

                setFrames(frames);
            }
        })();
    }, [releaseNums]);

    return (
        <>
            {/* <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: "rgba(0,0,0,.25)",
                    pointerEvents: 'none'
                }}
            >
            </div> */}

            <Resizable
                containerRef={containerRef}
            >
                <ImageAutoPlay 
                    frames={frames}
                />
            </Resizable>
        </>
    );
};

export default AnimationPanel;
