import './LoadingIndicator.scss'
import React from 'react';

const LoadingIndicator = () => {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className='spinner-wrap'>
                <div className='frames-loading-indicator'></div>
            </div>
            
            <span className='text-white font-size-1'>fetching tiles...</span>
        </div>
    )
}

export default LoadingIndicator
