// import './AnimationModeToogleBtn.css';
import React, { useCallback, useContext } from 'react';

import classnames from 'classnames';

import { useSelector, useDispatch, batch } from 'react-redux';

import {
    isAnimationModeOnSelector,
    toggleAnimationMode,
} from '@store/reducers/AnimationMode';
import { AppContext } from '@contexts/AppContextProvider';

const AnimationModeToogleBtn = () => {
    const dispatch = useDispatch();

    const { isMobile } = useContext(AppContext);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const onClickHandler = useCallback(() => {
        dispatch(toggleAnimationMode());
    }, []);

    return !isMobile ? (
        <div
            className={classnames(
                'relative w-full cursor-pointer my-3 text-center',
                {
                    'is-open': isAnimationModeOn,
                }
            )}
            // style={{
            //     height: 50,
            //     width: '100%',
            //     cursor: 'pointer',
            //     display: 'flex',
            //     justifyContent: 'center'
            // }}
            onClick={onClickHandler}
            title="Toggle Animate Mode"
        >
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="32" width="32">
                <path d="M12 9.523v12.954l9.5-6.476zm1 1.892l6.725 4.586L13 20.585zM2 5v22h28V5zm27 21H3V6h26z"/><path fill="none" d="M0 0h32v32H0z"/>
            </svg> */}
            <calcite-icon icon="play" scale="l" />
        </div>
    ) : null;
};

export default AnimationModeToogleBtn;
