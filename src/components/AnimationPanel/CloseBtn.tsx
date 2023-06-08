import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { toggleAnimationMode } from '@store/AnimationMode/reducer';

const CloseBtn = () => {
    const dispatch = useDispatch();

    const onClickHandler = useCallback(() => {
        dispatch(toggleAnimationMode());
    }, []);

    return (
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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="64"
                width="64"
                viewBox="0 0 32 32"
            >
                <path
                    d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"
                    fill="#fff"
                />
                <path fill="none" d="M0 0h32v32H0z" />
            </svg>
        </div>
    );
};

export default CloseBtn;
