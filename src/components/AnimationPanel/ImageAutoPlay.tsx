import React from 'react'

type Props = {
    frames: string[]
}

const ImageAutoPlay:React.FC<Props> = ({
    frames
}:Props) => {
    return frames && frames.length ? (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: `url(${frames[0]})`,
                border: '1px solid red',
                boxSizing: 'border-box',
            }}
        ></div>
    ) : null;
}

export default ImageAutoPlay
