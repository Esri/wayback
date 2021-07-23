import React from 'react'

const LoadingIndicator = () => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <span className='text-white font-size-1'>fetching tiles...</span>
        </div>
    )
}

export default LoadingIndicator
