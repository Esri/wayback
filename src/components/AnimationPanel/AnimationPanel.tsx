import React, { useCallback, useEffect, useRef, useState } from 'react';

import MapView from '@arcgis/core/views/MapView';

import { generateFrames } from './generateFrames4GIF';

import Resizable from './Resizable';
import ImageAutoPlay from './ImageAutoPlay';
import LoadingIndicator from './LoadingIndicator';

import { whenTrue } from '@arcgis/core/core/watchUtils';

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

    const resizeOnChangeEndDelay = useRef<NodeJS.Timeout>();

    const getAnimationFrames = useCallback(
        async() => {
            // console.log('calling getAnimationFrames', releaseNums)

            if(releaseNums.length){

                const frames = await getFrames({
                    releaseNums,
                    container: containerRef.current,
                    mapView
                });

                setFrames(frames);
            }
        },
        [releaseNums],
    );

    const resizableOnChange = ()=>{
        
        setFrames(null);

        clearTimeout(resizeOnChangeEndDelay.current)

        resizeOnChangeEndDelay.current = setTimeout(()=>{
            getAnimationFrames()
        }, 500)
    }

    useEffect(() => {
        getAnimationFrames();
    }, [releaseNums]);
    
    useEffect(()=>{
        const onUpdating = whenTrue(mapView, 'updating', ()=>{
            setFrames(null);
        })

        return ()=>{
            // onStationary.remove();
            onUpdating.remove();
        }
    }, []);

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
                onChange={resizableOnChange}
                containerRef={containerRef}
            >
                {
                    frames && frames.length 
                    ?  (
                        <ImageAutoPlay 
                            frames={frames}
                        />
                    ) 
                    : (
                        <LoadingIndicator />
                    )
                }
            </Resizable>
        </>
    );
};

export default AnimationPanel;
