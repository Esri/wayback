import React, {
    useEffect,
    useRef,
    useState
} from 'react'

type Props = {
    frames: string[]
}

const ImageAutoPlay:React.FC<Props> = ({
    frames
}:Props) => {

    const [idx, setIdx] = useState<number>(0)

    useEffect(()=>{

        const interval = setInterval(()=>{
            setIdx(idx=>{
                return idx + 1 >= frames.length ? 0 : idx + 1
            })
            // console.log(idxRef.current)
        }, 1000)

        return ()=>{
            clearInterval(interval)
        }
    }, [])

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: `url(${frames[idx]})`,
                boxSizing: 'border-box',
            }}
        ></div>
    );
}

export default ImageAutoPlay
