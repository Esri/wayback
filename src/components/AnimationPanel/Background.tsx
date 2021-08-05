import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toggleAnimationMode } from '../../store/reducers/AnimationMode';

const Background = () => {

    const dispatch = useDispatch();

    const onClickHandler = useCallback(() => {
        dispatch(toggleAnimationMode());
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                // background: 'rgba(0,0,0,.25)',
                // background: "linear-gradient(0deg, rgba(0,0,0,9) 0%, rgba(0,0,0,.3) 20%, rgba(0,0,0,.2) 50%, rgba(0,0,0,.3) 80%, rgba(0,0,0,9) 100%)",
                background: "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,.3) 50%, rgba(0,0,0,.7) 100%)",
                pointerEvents: 'none'
            }}
        >
            <div 
                onClick={onClickHandler}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    cursor: 'pointer',
                    pointerEvents: 'initial',
                    zIndex: 5,
                }}
            > 
                <svg xmlns="http://www.w3.org/2000/svg" height="64" width="64" viewBox="0 0 32 32">
                    <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z" fill="#fff" /><path fill="none" d="M0 0h32v32H0z"/>
                </svg>
            </div>
        </div>
    )
}

export default Background
