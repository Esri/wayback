import React, { useEffect } from 'react'

type Props = {
    isPlaying: boolean;
    onClick: ()=>void;
}

const PlayBtn = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16"><path d="M4 1.571l10 6.43-10 6.428z" fill="#ccc"/><path fill="none" d="M0 0h16v16H0z"/></svg>
);

const PauseBtn = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16"><path d="M2 1h5v14H2zm12 0H9v14h5z" fill="#ccc"/><path fill="none" d="M0 0h16v16H0z"/></svg>
);

const PlayPauseBtn:React.FC<Props> = ({
    isPlaying,
    onClick
}:Props) => {

    return (
        <div 
            className='margin-right-half cursor-pointer'
            style={{
                display: 'flex'
            }}
            onClick={onClick}
        >
            { isPlaying ? PauseBtn : PlayBtn }
        </div>
    )
}

export default PlayPauseBtn
