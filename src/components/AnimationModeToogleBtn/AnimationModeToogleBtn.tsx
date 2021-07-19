import React from 'react'

import { useSelector, useDispatch, batch } from 'react-redux';

import { 
    toggleAnimationMode 
} from '../../store/reducers/AnimationMode'

const AnimationModeToogleBtn = () => {

    const dispatch = useDispatch();

    const onClickHandler = () => {
        batch(() => {
            dispatch(toggleAnimationMode());
        });
    };

    return (
        <div
            className='gutter-nav-btn'
            style={{
                height: 50,
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center'
            }}
            onClick={onClickHandler}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="32" width="32">
                <path d="M12 9.523v12.954l9.5-6.476zm1 1.892l6.725 4.586L13 20.585zM2 5v22h28V5zm27 21H3V6h26z"/><path fill="none" d="M0 0h32v32H0z"/>
            </svg>
        </div>
    )
}

export default AnimationModeToogleBtn
