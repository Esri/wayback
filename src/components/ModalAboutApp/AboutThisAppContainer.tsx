import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    isAboutThisAppModalOpenSelector,
    isAboutThisAppModalOpenToggled,
} from '@store/reducers/UI';

import AboutThisApp from './index';

const AboutThisAppContainer = () => {
    const isOpen = useSelector(isAboutThisAppModalOpenSelector);

    const dispatch = useDispatch();

    const onCloseHandler = () => {
        dispatch(isAboutThisAppModalOpenToggled());
    };

    return isOpen ? <AboutThisApp onClose={onCloseHandler} /> : null;
};

export default AboutThisAppContainer;
