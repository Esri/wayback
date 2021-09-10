import React, { useContext } from 'react';

import {
    useSelector,
    useDispatch,
    batch,
    // batch
} from 'react-redux';

import { AppContext } from '../../contexts/AppContextProvider';

import {
    activeWaybackItemSelector,
    previewWaybackItemSelector,
} from '../../store/reducers/WaybackItems';

import { shouldShowPreviewItemTitleSelector } from '../../store/reducers/UI';

import Title4ActiveItem from './index';

const Title4ActiveItemContainer = () => {
    const { isMobile } = useContext(AppContext);

    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    const previewWaybackItem = useSelector(previewWaybackItemSelector);

    const shouldShowPreviewItemTitle = useSelector(
        shouldShowPreviewItemTitleSelector
    );

    return (
        <Title4ActiveItem
            isMobile={isMobile}
            activeWaybackItem={activeWaybackItem}
            previewWaybackItem={previewWaybackItem}
            shouldShowPreviewItemTitle={shouldShowPreviewItemTitle}
        />
    );
};

export default Title4ActiveItemContainer;
