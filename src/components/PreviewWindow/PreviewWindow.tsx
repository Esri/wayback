import './style.scss';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { IWaybackItem } from '../../types';
// import { geometryFns } from 'helper-toolkit-ts';
import MapView from '@arcgis/core/views/MapView';

// import styled from 'styled-components';
import { generateFrames } from './utils';

export const PREVIEW_WINDOW_WIDTH = 500;
export const PREVIEW_WINDOW_HEIGHT = 300;

type Props = {
    mapView?: MapView;
    previewWaybackItem: IWaybackItem;
    alternativeRNum4RreviewWaybackItem: number;
};

const PreviewWindow: React.FC<Props> = ({
    previewWaybackItem,
    alternativeRNum4RreviewWaybackItem,
    mapView,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>();

    const [imageUrl, setImageUrl] = useState<string>();

    // left position of map view container DIV relative to the window
    const mapViewContainerLeftPos = useMemo(() => {
        if (!mapView || !mapView.container) {
            return 0;
        }

        const { left } = mapView.container.getBoundingClientRect();

        return left;
    }, [mapView]);

    const fetchPreviewWindowImage = async (releaseNum: number) => {
        const container = containerRef.current;

        const elemRect = container.getBoundingClientRect();
        // console.log(elemRect)

        const { offsetHeight, offsetWidth } = container;

        const [image] = await generateFrames({
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
    };

    useEffect(() => {
        if (!previewWaybackItem) {
            setImageUrl('');
            return;
        }

        fetchPreviewWindowImage(alternativeRNum4RreviewWaybackItem);
    }, [previewWaybackItem, alternativeRNum4RreviewWaybackItem]);

    if (!previewWaybackItem) {
        return null;
    }

    return (
        <div
            className="preview-window-container"
            ref={containerRef}
            style={{
                top: `calc(50% - ${PREVIEW_WINDOW_HEIGHT / 2}px)`,
                left: `calc(50% - ${PREVIEW_WINDOW_WIDTH / 2}px)`,
                width: `${PREVIEW_WINDOW_WIDTH}px`,
                height: `${PREVIEW_WINDOW_HEIGHT}px`,
            }}
        >
            <img src={imageUrl} />
            <div className="preview-item-info">
                <span
                    style={{
                        fontSize: '.95rem',
                    }}
                >
                    <b>Wayback {previewWaybackItem.releaseDateLabel}</b> preview
                </span>
            </div>
        </div>
    );
};

export default PreviewWindow;
