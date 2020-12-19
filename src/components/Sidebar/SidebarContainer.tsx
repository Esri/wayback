import React from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import{
    isSwipeWidgetOpenSelector,
} from '../../store/reducers/SwipeView';

import{
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
    Spacing
} from '../SharedUI'

const FlexyContainer:React.FC = ({
    children
})=>{
    return (
        <div className="leader-half fancy-scrollbar"
            style={{
                position: 'relative',
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 200,
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            <Spacing
                paddingLeft='1rem'
                paddingRight='1rem'
            >
                { children }
            </Spacing>
        </div>
    )
};

const SidebarContainer = () => {

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isHide = useSelector(isSideBarHideSelector);

    return (
        <Sidebar
            isHide={isHide || isSwipeWidgetOpen}
        >
            <SidebarToggleBtn />

            <Spacing
                paddingLeft='1rem'
                paddingRight='1rem'
            >
                <AppTitleText />

                <BarChart />

                <Title4ActiveItem />

                <ShowLocalChangesCheckboxToggle />

            </Spacing>

            <FlexyContainer>
                <ListView />
            </FlexyContainer>

        </Sidebar>
    )
}

export default SidebarContainer
