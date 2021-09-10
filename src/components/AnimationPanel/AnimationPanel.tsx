import React, { useCallback, useEffect, useRef, useState } from 'react';

import MapView from '@arcgis/core/views/MapView';

import { FrameData, generateFrames } from './generateFrames4GIF';

import Resizable from './Resizable';
import ImageAutoPlay from './ImageAutoPlay';
import LoadingIndicator from './LoadingIndicator';
import DownloadGIFDialog from './DownloadGIFDialog';
import CloseBtn from './CloseBtn'

import { whenFalse } from '@arcgis/core/core/watchUtils';
import { IWaybackItem } from '../../types';
import { useDispatch, useSelector } from 'react-redux';

import {
    animationSpeedSelector,
    // indexOfCurrentFrameChanged,
    // isAnimationModeOnSelector,
    isDownloadGIFDialogOnSelector,
    rNum2ExcludeSelector,
    // startAnimation,
    toggleIsLoadingFrameData
} from '../../store/reducers/AnimationMode'
import Background from './Background';

type Props = {
    waybackItems4Animation: IWaybackItem[]
    mapView?: MapView;
};

type GetFramesParams = {
    waybackItems: IWaybackItem[],
    // releaseNums:number[], 
    container: HTMLDivElement, 
    mapView: MapView,
}

type GetFramesResponse = {
    data: FrameData[];
    taskInfo: string;
}

type GetTaskFingerPrintParams = {
    container: HTMLDivElement, 
    mapView: MapView,
}

// width of Gutter and Side Bar, need to calculate this dynamically
export const PARENT_CONTAINER_LEFT_OFFSET = 350;

const getFrames = async ({
    waybackItems,
    // releaseNums, 
    container, 
    mapView
}:GetFramesParams):Promise<GetFramesResponse> => {

    const taskInfo = getAnimationTaskInfo({
        container, mapView
    });

    const elemRect = container.getBoundingClientRect();
    // console.log(elemRect)

    const { offsetHeight, offsetWidth } = container;
    // const releaseNums = waybackItems.map(d=>d.releaseNum)

    const data = await generateFrames({
        frameRect: {
            screenX: elemRect.left - PARENT_CONTAINER_LEFT_OFFSET,
            screenY: elemRect.top,
            width: offsetWidth,
            height: offsetHeight,
        },
        mapView,
        waybackItems
    });

    return {
        data,
        taskInfo
    };
};

// get a string that represent current Map (extent) and UI State (size, position of the Resize component)
// this string will be used as a finger print to check if frame data returned by getFrames match the current Map and UI state, 
// sometimes multiple getFrames calls can be triggered (zoom the map after resizing the window) and we should only show the response from the last request
const getAnimationTaskInfo = ({
    container, 
    mapView
}:GetTaskFingerPrintParams):string=>{

    if(!mapView || !container){
        return ''
    }

    const {
        xmax, xmin, ymax, ymin
    } = mapView.extent;

    const { left, top } = container.getBoundingClientRect();

    const { offsetHeight, offsetWidth } = container;

    return [ xmax, xmin, ymax, ymin, left, top, offsetHeight, offsetWidth ].join('#');
}

const containerRef = React.createRef<HTMLDivElement>();

const AnimationPanel: React.FC<Props> = ({ waybackItems4Animation, mapView }: Props) => {

    const dispatch = useDispatch()

    // array of frame images as dataURI string 
    const [frameData, setFrameData] = useState<FrameData[]>(null);

    const loadingWaybackItems4AnimationRef = useRef<boolean>(false);

    const getAnimationFramesDelay = useRef<NodeJS.Timeout>();

    const waybackItems4AnimationRef = useRef<IWaybackItem[]>();

    const isDownloadGIFDialogOn = useSelector(isDownloadGIFDialogOnSelector)

    // in second
    const animationSpeed = useSelector(animationSpeedSelector)

    // release numbers for the frames to be excluded from animation
    const rNum2Exclude = useSelector(rNum2ExcludeSelector);

    const getAnimationFrames = useCallback(
        () => {
            // in milliseconds
            const DELAY_TIME = 1500;

            clearTimeout(getAnimationFramesDelay.current)

            getAnimationFramesDelay.current = setTimeout(async()=>{

                try {
                    const waybackItems = waybackItems4AnimationRef.current;

                    const container = containerRef.current;

                    if(!waybackItems || !waybackItems.length || loadingWaybackItems4AnimationRef.current){
                        return;
                    }        

                    const {
                        data, 
                        taskInfo
                    } = await getFrames({
                        waybackItems,
                        container,
                        mapView,
                    });

                    if(taskInfo !== getAnimationTaskInfo({ mapView, container }) ){
                        console.error('animation task info doesn\'t match current map or UI state, ignore frame data returned by this task')
                        return;
                    }

                    setFrameData(data);

                } catch(err){
                    console.error(err);
                }

            }, DELAY_TIME)
        },
        [waybackItems4Animation],
    );

    const resizableOnChange = useCallback(()=>{
        
        setFrameData(null);

        getAnimationFrames()
    }, []);

    useEffect(() => {
        waybackItems4AnimationRef.current = waybackItems4Animation;

        loadingWaybackItems4AnimationRef.current = false;

        getAnimationFrames()

    }, [waybackItems4Animation]);
    
    useEffect(()=>{
        const onUpdating = whenFalse(mapView, 'stationary', ()=>{
            loadingWaybackItems4AnimationRef.current = true;
            setFrameData(null);
        })

        return ()=>{
            // onStationary.remove();
            onUpdating.remove();
        }
    }, []);

    useEffect(()=>{
        const isLoading = frameData === null;
        dispatch(toggleIsLoadingFrameData(isLoading))
    }, [frameData]);

    return (
        <>
            <Background />

            <Resizable
                onChange={resizableOnChange}
                containerRef={containerRef}
            >
                {
                    frameData && frameData.length 
                    ?  (
                        <ImageAutoPlay 
                            frameData={frameData}
                            // rNum2Exclude={rNum2Exclude}
                            // speed={animationSpeed}
                        />
                    ) 
                    : (
                        <LoadingIndicator />
                    )
                }
            </Resizable>

            <CloseBtn />

            {
                isDownloadGIFDialogOn 
                    ? <DownloadGIFDialog frameData={frameData} rNum2Exclude={rNum2Exclude} speed={animationSpeed}/> 
                    : null
            }
        </>
    );
};

export default AnimationPanel;
