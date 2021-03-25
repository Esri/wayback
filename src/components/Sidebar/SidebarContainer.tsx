import React, { useContext } from 'react';

import { useSelector } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '../../store/reducers/SwipeView';

import {
    isGutterHideSelector,
    isSideBarHideSelector,
} from '../../store/reducers/UI';

import Sidebar from './Sidebar';
import { AppContext } from '../../contexts/AppContextProvider';

const SidebarContainer: React.FC = ({ children }) => {
    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isHide = useSelector(isSideBarHideSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    return (
        <Sidebar
            isHide={isHide || isSwipeWidgetOpen}
            isGutterHide={isGutterHide}
            isMobile={isMobile}
        >
            {children}
        </Sidebar>
    );
};

export default SidebarContainer;
