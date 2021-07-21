import React from 'react'

type Props = {
    images: string[]
}

const ImageAutoPlay:React.FC<Props> = ({
    images
}:Props) => {
    return images && images.length ? (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            
        </div>
    ) : null;
}

export default ImageAutoPlay
