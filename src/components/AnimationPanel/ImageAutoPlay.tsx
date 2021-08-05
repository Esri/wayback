import React, {
    useEffect,
    useRef,
    useState
} from 'react'
import { batch, useDispatch, useSelector } from 'react-redux';
import { indexOfCurrentAnimationFrameSelector, indexOfCurrentFrameChanged, isAnimationPlayingSelector, startAnimation } from '../../store/reducers/AnimationMode';
// import { animationSpeedSelector } from '../../store/reducers/AnimationMode';

// import { useSelector } from 'react-redux';

// import {
//     rNum2ExcludeSelector,
// } from '../../store/reducers/AnimationMode'

import { FrameData } from './generateFrames4GIF';

type Props = {
    frameData: FrameData[];
    // rNum2Exclude: number[];
    // speed: number;
}

const ImageAutoPlay:React.FC<Props> = ({
    frameData,
    // rNum2Exclude,
    // speed
}:Props) => {

    const dispatch = useDispatch()

    // const [idx, setIdx] = useState<number>(0);

    // // list of frames that will be shown in the final animation
    // const [activeFrames, setActiveFrame ] = useState<FrameData[]>([]);

    // const interval4ImageRotation = useRef<NodeJS.Timeout>();

    // const setActiveFrameDelay = useRef<NodeJS.Timeout>();

    // const isPlaying = useSelector(isAnimationPlayingSelector)
    
    // useEffect(()=>{

    //     clearInterval(interval4ImageRotation.current)

    //     if(!activeFrames || !activeFrames.length || !isPlaying){
    //         return;
    //     }

    //     interval4ImageRotation.current = setInterval(()=>{
    //         setIdx(idx=>{
    //             return idx + 1 >= activeFrames.length ? 0 : idx + 1
    //         })
    //         // console.log(idxRef.current)
    //     }, speed * 1000)
        
    // }, [activeFrames, speed, isPlaying])

    // useEffect(()=>{

    //     clearTimeout(setActiveFrameDelay.current);

    //     const frames2show = rNum2Exclude.length 
    //         ? frameData.filter(d=>{
    //             return rNum2Exclude.indexOf(d.releaseNum) === -1;
    //         })
    //         : frameData;

    //     if(!activeFrames.length){
    //         setActiveFrame(frames2show);
    //     } else {
    //         setActiveFrameDelay.current = setTimeout(()=>{
    //             setActiveFrame(frames2show);
    //         }, 1000)
    //     }
    // }, [rNum2Exclude]);

    const idx = useSelector(indexOfCurrentAnimationFrameSelector);

    const isPlaying = useSelector(isAnimationPlayingSelector)

    const getCurrentFrame = ()=>{

        if(!frameData || !frameData.length){
            return null
        }

        const { frameDataURI } = frameData[idx] || frameData[0];

        // const {releaseDateLabel} = waybackItem;

        return (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: `url(${frameDataURI})`,
                    boxSizing: 'border-box',
                }}
            >
            </div>
        )
    }

    useEffect(()=>{

        batch(()=>{
            dispatch(indexOfCurrentFrameChanged(0))

            if(isPlaying){
                dispatch(startAnimation())
            }
        })

    }, [frameData])

    // useEffect(()=>{

    //     return ()=>{
    //         clearInterval(interval4ImageRotation.current)
    //         clearTimeout(setActiveFrameDelay.current)
    //     }
    // }, [])

    return getCurrentFrame();
}

export default ImageAutoPlay
