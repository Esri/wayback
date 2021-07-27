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
    frames: FrameData[]
}

const ImageAutoPlay:React.FC<Props> = ({
    frames
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
            ? frames.filter(d=>{
                return rNum2Exclude.indexOf(d.releaseNum) === -1;
            })
            : frames;

        if(!activeFrames.length){
            setActiveFrame(frames2show);
        } else {
            setActiveFrameDelay.current = setTimeout(()=>{
                setActiveFrame(frames2show);
            }, 1000)
        }
    }, [rNum2Exclude]);

    const getBackgrounImage = ()=>{

        if(!activeFrames || !activeFrames.length){
            return ''
        }

        if(!activeFrames[idx]){
            return activeFrames[0] ? activeFrames[0].frameDataURI : ''
        }

        return `url(${activeFrames[idx].frameDataURI})`
    }

    useEffect(()=>{

        return ()=>{
            clearInterval(interval4ImageRotation.current)
            clearTimeout(setActiveFrameDelay.current)
        }
    }, [])

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: getBackgrounImage(),
                boxSizing: 'border-box',
            }}
        ></div>
    );
}

export default ImageAutoPlay
