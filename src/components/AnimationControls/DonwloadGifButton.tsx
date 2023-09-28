import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import {
    isDownloadGIFDialogOnToggled,
    isLoadingFrameDataSelector,
} from '@store/AnimationMode/reducer';

const DonwloadGifButton = () => {
    const dispatch = useDispatch();

    const isLoadingFrameData = useSelector(isLoadingFrameDataSelector);

    const onClickHandler = useCallback(() => {
        dispatch(isDownloadGIFDialogOnToggled());
    }, []);

    const classNames = classnames('btn btn-fill', {
        'btn-disabled': isLoadingFrameData,
    });

    return (
        <div className={classNames} onClick={onClickHandler}>
            Download GIF
        </div>
    );
};

export default DonwloadGifButton;
