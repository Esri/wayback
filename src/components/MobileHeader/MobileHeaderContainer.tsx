import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { isGutterHideSelector, isGutterHideToggled } from '@store/UI/reducer';

import { MobileShow } from '../SharedUI';
import MobileHeader from './index';

const MobileHeaderContainer = () => {
    const isGutterHide = useSelector(isGutterHideSelector);

    const dispatch = useDispatch();

    return (
        <MobileShow>
            <MobileHeader
                isGutterHide={isGutterHide}
                leftNavBtnOnClick={() => {
                    dispatch(isGutterHideToggled());
                }}
            />
        </MobileShow>
    );
};

export default MobileHeaderContainer;
