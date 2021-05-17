// preview the tile image that interscets with the center of the map view
// import { loadModules } from 'esri-loader';

// import './style.scss';
import React, { useState } from 'react';
import { IWaybackItem } from '../../types';
// import { geometryFns } from 'helper-toolkit-ts';

import MapView from '@arcgis/core/views/MapView';
// import Point from '@arcgis/core/geometry/Point';
// import { lngLatToXY } from '@arcgis/core/geometry/support/webMercatorUtils';
// import { getCurrZoomLevel } from '../MapView/MapView'

import styled from 'styled-components';

const WIDTH = 500;
const HEIGHT = 300;

const PreviewWindowContainer = styled.div`
    position: absolute;
    top: calc(50% - ${HEIGHT / 2}px);
    left: calc(50% - ${WIDTH / 2}px);
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    // background: #888;
    pointer-events: none;
    z-index: 5;
    border: solid 1px rgba(240,240,240,.5);
    box-shadow: 0 0 10px 10px rgba(0,0,0,.6);
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

    const [imageUrl, setImageUrl] = useState<string>()

    return previewWaybackItem ? (
        <PreviewWindowContainer>
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
