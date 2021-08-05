// import './LoadingIndicator.scss'
import React from 'react';

import LoadingSpinner from './LoadingSpinner'

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
                textShadow: `0 0 3px #000`
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: -1,
                    left: 0,
                    width: '100%'
                }}
            >
                <LoadingSpinner />
            </div>
            
            <span className='text-white font-size-1'>Loading imagery</span>
        </div>
    )
}

export default LoadingIndicator
