import React, { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    isSideBarHideSelector,
    isSideBarHideToggled,
} from '@store/reducers/UI';

import SidebarToggleBtn from './index';
import { MobileShow } from '../SharedUI/';

const SidebarToogleBtnContainer = () => {
    const dispatch = useDispatch();

    const isHide = useSelector(isSideBarHideSelector);

    const onClickHandler = useCallback(() => {
        dispatch(isSideBarHideToggled());
    }, []);

    return (
        <MobileShow>
            <SidebarToggleBtn isSideBarHide={isHide} onClick={onClickHandler} />
        </MobileShow>
    );
};

export default SidebarToogleBtnContainer;
