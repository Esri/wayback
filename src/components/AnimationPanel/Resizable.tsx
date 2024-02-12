/* Copyright 2024 Esri
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

import React, {
    useRef,
    // useMemo,
    useState,
    useEffect,
    useCallback,
} from 'react';
import {
    PREVIEW_WINDOW_HEIGHT,
    PREVIEW_WINDOW_WIDTH,
} from '../PreviewWindow/PreviewWindow';

import { PARENT_CONTAINER_LEFT_OFFSET } from './AnimationPanel';

type Position = {
    top: number;
    left: number;
};

type Size = {
    height: number;
    width: number;
};

type Props = {
    containerRef: React.RefObject<HTMLDivElement>;
    children?: React.ReactNode;
    // eithe size or position is updated
    onChange?: () => void;
};

const CONTAINER_MIN_SIZE = 260;

// const CONTAINER_DEFAULT_SIZE = 300;

const Resizable: React.FC<Props> = ({
    containerRef,
    onChange,
    children,
}: Props) => {
    // const containerRef = useRef<HTMLDivElement>();

    // const resizeBtnRef = useRef<HTMLDivElement>();

    const [position, setPosition] = useState<Position>();

    const [size, setSize] = useState<Size>({
        width: PREVIEW_WINDOW_WIDTH,
        height: PREVIEW_WINDOW_HEIGHT,
    });

    // when the container is being dragged, we keep updating it's position using current mouse position,
    // by default, the top left corner of the container will be snapped to the new position,
    // but this is not an ideal user experience, consider user dragging the container by holding the bottom right corner of the container,
    // let's say user moves the mouse to the right by 50px, and what they want by doing that is moving the top left corner of the container by 50px,
    // instead of moving the top left corner down to the current mouse position
    // therefore we need to know/save the offset between container's top left corner and mouse position when the drag event is started,
    // and we will use it when calculate the new position for the container
    const positionOffset = useRef<Position>(null);

    const mouseOnMoveHandler = useCallback((evt: MouseEvent) => {
        const { clientX, clientY } = evt;

        const { offsetLeft, offsetTop, offsetHeight, offsetWidth } =
            containerRef.current;

        if (!positionOffset.current) {
            positionOffset.current = {
                top: clientY - offsetTop,
                left: clientX - offsetLeft,
            };
        }

        let left = clientX - positionOffset.current.left;

        if (left < 0) {
            left = 0;
        }

        // reach to the right end of view port
        if (
            left + PARENT_CONTAINER_LEFT_OFFSET + offsetWidth >=
            window.innerWidth
        ) {
            left =
                window.innerWidth - offsetWidth - PARENT_CONTAINER_LEFT_OFFSET;
        }

        let top = clientY - positionOffset.current.top;

        if (top < 0) {
            top = 0;
        } else if (top + offsetHeight > window.innerHeight) {
            top = window.innerHeight - offsetHeight;
        }

        setPosition({
            top,
            left,
        });

        onChange();
    }, []);

    const resize = useCallback((evt: MouseEvent) => {
        // console.log('resizing')

        const { clientX, clientY } = evt;

        const { offsetLeft, offsetTop } = containerRef.current;

        const newWidth = clientX - PARENT_CONTAINER_LEFT_OFFSET - offsetLeft;
        const newHeight = clientY - offsetTop;

        setSize({
            width:
                newWidth >= CONTAINER_MIN_SIZE ? newWidth : CONTAINER_MIN_SIZE,
            height:
                newHeight >= CONTAINER_MIN_SIZE
                    ? newHeight
                    : CONTAINER_MIN_SIZE,
        });

        onChange();
    }, []);

    const addUpdatePositionHanlder = useCallback(
        (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            window.addEventListener('mousemove', mouseOnMoveHandler);
        },
        []
    );

    const removeUpdatePositionHanlder = useCallback(() => {
        positionOffset.current = null;
        window.removeEventListener('mousemove', mouseOnMoveHandler);
    }, []);

    const addResizeHandler = useCallback((evt: any) => {
        evt.stopPropagation();
        window.addEventListener('mousemove', resize);
    }, []);

    const removeResizeHandler = useCallback((evt: any) => {
        window.removeEventListener('mousemove', resize);
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', removeUpdatePositionHanlder);
        window.addEventListener('mouseup', removeResizeHandler);

        return () => {
            window.removeEventListener('mouseup', removeUpdatePositionHanlder);
            window.removeEventListener('mouseup', removeResizeHandler);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: position
                    ? position.top
                    : `calc(50% - ${PREVIEW_WINDOW_HEIGHT / 2}px)`, //position.top,
                left: position
                    ? position.left
                    : `calc(50% - ${PREVIEW_WINDOW_WIDTH / 2}px)`, //position.left,
                height: size.height,
                width: size.width,
                zIndex: 5,
                // background: 'rgba(0,0,0,.75)',
                boxShadow: '0 0 10px 10px rgba(0,0,0,.6)',
                cursor: 'move',
                userSelect: 'none',
                border: '1px solid rgba(255,255,255,.95)',
            }}
            onMouseDown={addUpdatePositionHanlder}
        >
            {children}

            <div
                // ref={resizeBtnRef}
                style={{
                    position: 'absolute',
                    right: -7,
                    bottom: -7,
                    height: 14,
                    width: 14,
                    background: '#2C67AC',
                    borderRadius: '50%',
                    border: '1px solid #fff',
                    cursor: 'se-resize',
                }}
                onMouseDown={addResizeHandler}
            ></div>
        </div>
    );
};

export default Resizable;
