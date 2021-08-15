
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { IWaybackItem } from '../../types';
// import { geometryFns } from 'helper-toolkit-ts';

import MapView from '@arcgis/core/views/MapView';

import styled from 'styled-components';

import {
    generateFrames
} from './utils';

export const PREVIEW_WINDOW_WIDTH = 500;
export const PREVIEW_WINDOW_HEIGHT = 300;

const PreviewWindowContainer = styled.div`
    position: absolute;
    top: calc(50% - ${PREVIEW_WINDOW_HEIGHT / 2}px);
    left: calc(50% - ${PREVIEW_WINDOW_WIDTH / 2}px);
    width: ${PREVIEW_WINDOW_WIDTH}px;
    height: ${PREVIEW_WINDOW_HEIGHT}px;
    // background: #888;
    pointer-events: none;
    z-index: 5;
    border: solid 1px rgba(240,240,240,.5);
    box-shadow: 0 0 10px 10px rgba(0,0,0,.6);
    box-sizing: border-box;
`;

const PreviewImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const PreviewItemInfo = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: .35rem .5rem;
    // background: linear-gradient(to bottom, rgba(0,0,0,.8) , rgba(0,0,0,.4) );
    background: rgba(44,103,172, 0.75);
    color: #fff;
    box-sizing: border-box;
`

type Props = {
    mapView?: MapView;
    previewWaybackItem: IWaybackItem;
    alternativeRNum4RreviewWaybackItem: number;
}

const PreviewWindow:React.FC<Props> = ({
    previewWaybackItem,
    alternativeRNum4RreviewWaybackItem,
    mapView
}:Props)=>{

    const containerRef = useRef<HTMLDivElement>()

    const [imageUrl, setImageUrl] = useState<string>();

    // left position of map view container DIV relative to the window
    const mapViewContainerLeftPos = useMemo(()=>{
        if(!mapView || !mapView.container){
            return 0;
        }

        const {
            left
        } = mapView.container.getBoundingClientRect();

        return left;
    }, [mapView])

    const fetchPreviewWindowImage = async(releaseNum:number)=>{
        const container = containerRef.current;

        const elemRect = container.getBoundingClientRect();
        // console.log(elemRect)

        const { offsetHeight, offsetWidth } = container;

        const [ image ] = await generateFrames({
            frameRect: {
                // elemRect.left is the left position of the container DIV relative to map view container,
                // therefore, we need to add the mapViewContainerLeft to it to get the 
                // left position of the container DIV relative to window
                screenX: elemRect.left - mapViewContainerLeftPos,
                screenY: elemRect.top,
                width: offsetWidth,
                height: offsetHeight,
            },
            mapView,
            releaseNums: [releaseNum.toString()],
        });

        setImageUrl(image);
    }

    useEffect(()=>{

        if(!previewWaybackItem){
            setImageUrl('');
            return;
        }

        fetchPreviewWindowImage(alternativeRNum4RreviewWaybackItem);

    }, [previewWaybackItem, alternativeRNum4RreviewWaybackItem])

    return previewWaybackItem ? (
        <PreviewWindowContainer
            ref={containerRef}
        >
            <PreviewImage src={imageUrl} />
            <PreviewItemInfo>
                <span 
                    style={{
                        fontSize: '.95rem'
                    }}
                >
                    <b>Wayback {previewWaybackItem.releaseDateLabel}</b>{' '}
                    preview
                </span>
            </PreviewItemInfo>
        </PreviewWindowContainer>
    ) : null;
}

export default PreviewWindow;
