import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    isShareModalOpenSelector,
    isShareModalOpenToggled,
} from '@store/reducers/UI';

import ShareDialog from './index';

const ShareDialogContainer = () => {
    const isOpen = useSelector(isShareModalOpenSelector);

    const dispatch = useDispatch();

    const onCloseHandler = () => {
        dispatch(isShareModalOpenToggled());
    };

    return isOpen ? (
        <ShareDialog currentUrl={location.href} onClose={onCloseHandler} />
    ) : null;
};

export default ShareDialogContainer;
