import React, { useRef, useEffect, useState } from 'react';

import IMapView from 'esri/views/MapView';

import { generateFrames } from './generateFrames4GIF';

import Resizable from './Resizable';

type Props = {
    releaseNums: string[]
    mapView?: IMapView;
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

const AnimationPanel: React.FC<Props> = ({ releaseNums, mapView }: Props) => {

    const containerRef = useRef<HTMLDivElement>();

    const [backgroundImg, setBackgroundImg] = useState<string>();

    const getFrames = async () => {
        const container = containerRef.current;

        const elemRect = container.getBoundingClientRect();
        // console.log(elemRect)

        const { offsetHeight, offsetWidth } = container;

        const images = await generateFrames({
            frameRect: {
                screenX: elemRect.left - 300,
                screenY: elemRect.top,
                width: offsetWidth,
                height: offsetHeight,
            },
            mapView,
            releaseNums
        });

        setBackgroundImg(images[1]);

        // const createGIFCallback: CreateGIFCallBack = (response) => {
        //     if (!response.error) {
        //         setBackgroundImg(response.image);
        //     }
        // };

        // gifshot.createGIF(
        //     {
        //         images,
        //         frameDuration: 10,
        //         gifWidth: offsetWidth,
        //         gifHeight: offsetHeight,
        //         // showFrameText: true,
        //     },
        //     createGIFCallback
        // );
    };

    // useEffect(() => {
    //     // getFrames();
    // }, []);

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

            <Resizable>
                <div
                    ref={containerRef}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        background: backgroundImg
                            ? `url(${backgroundImg})`
                            : 'transparent',
                        border: '1px solid red',
                        boxSizing: 'border-box',
                    }}
                ></div>
            </Resizable>
        </>
    );
};

export default AnimationPanel;
