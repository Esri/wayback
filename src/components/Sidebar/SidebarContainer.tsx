import React, {
    useContext
} from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import{
    isSwipeWidgetOpenSelector,
} from '../../store/reducers/SwipeView';

import{
    isGutterHideSelector,
    isSideBarHideSelector,
} from '../../store/reducers/UI';

import Sidebar from './Sidebar';
import AppTitleText from '../TitleText';
import SidebarToggleBtn from '../SidebarToggleBtn/SidebarToogleBtnContainer';
import BarChart from '../BarChart/BarChartContainer';
import Title4ActiveItem from '../Title4ActiveItem/Title4ActiveItemContainer';
import ShowLocalChangesCheckboxToggle from '../ShowLocalChangesCheckboxToggle/ShowLocalChangesCheckboxToggleContainer';
import ListView from '../ListView/ListViewContainer';
import {
    MobileHide,
    Spacing
} from '../SharedUI'
import { AppContext } from '../../contexts/AppContextProvider';

const SidebarContainer:React.FC = ({
    children
}) => {

    const { isMobile } = useContext(AppContext)

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isHide = useSelector(isSideBarHideSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    return (
        <Sidebar
            isHide={isHide || isSwipeWidgetOpen}
            isGutterHide={isGutterHide}
            isMobile={isMobile}
        >
            { children }

        </Sidebar>
    )
}

export default SidebarContainer
