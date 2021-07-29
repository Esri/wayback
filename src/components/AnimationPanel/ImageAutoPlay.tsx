import React, {
    useEffect,
    useRef,
    useState
} from 'react'

import { useSelector } from 'react-redux';

import {
    rNum2ExcludeSelector,
} from '../../store/reducers/AnimationMode'
import { FrameData } from './generateFrames4GIF';

type Props = {
    frameData: FrameData[]
}

const ImageAutoPlay:React.FC<Props> = ({
    frameData
}:Props) => {

    const [idx, setIdx] = useState<number>(0);

    // list of frames that will be shown in the final animation
    const [activeFrames, setActiveFrame ] = useState<FrameData[]>([]);

    // release numbers for the frames to be excluded from animation
    const rNum2Exclude = useSelector(rNum2ExcludeSelector);

    const interval4ImageRotation = useRef<NodeJS.Timeout>();

    const setActiveFrameDelay = useRef<NodeJS.Timeout>();

    useEffect(()=>{

        clearInterval(interval4ImageRotation.current)

        if(!activeFrames || !activeFrames.length){
            return;
        }

        interval4ImageRotation.current = setInterval(()=>{
            setIdx(idx=>{
                return idx + 1 >= activeFrames.length ? 0 : idx + 1
            })
            // console.log(idxRef.current)
        }, 1000)
    }, [activeFrames])

    useEffect(()=>{

        clearTimeout(setActiveFrameDelay.current);

        const frames2show = rNum2Exclude.length 
            ? frameData.filter(d=>{
                return rNum2Exclude.indexOf(d.releaseNum) === -1;
            })
            : frameData;

        if(!activeFrames.length){
            setActiveFrame(frames2show);
        } else {
            setActiveFrameDelay.current = setTimeout(()=>{
                setActiveFrame(frames2show);
            }, 1000)
        }
    }, [rNum2Exclude]);

    const getCurrentFrame = ()=>{

        if(!activeFrames || !activeFrames.length){
            return null
        }

        const currFame = activeFrames[idx] || activeFrames[0];

        const {releaseDateLabel} = currFame.waybackItem;

        return (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: `url(${currFame.frameDataURI})`,
                    boxSizing: 'border-box',
                }}
            >
                <div className='text-white text-center'
                    style={{
                        position: 'absolute',
                        top: '.5rem',
                        width: '100%',
                        textShadow: `0 0 3px #000`
                    }}
                >
                    <span className='font-size-2'>{releaseDateLabel}</span>
                </div>
            </div>
        )
    }

    useEffect(()=>{

        return ()=>{
            clearInterval(interval4ImageRotation.current)
            clearTimeout(setActiveFrameDelay.current)
        }
    }, [])

    return getCurrentFrame();
}

export default ImageAutoPlay
