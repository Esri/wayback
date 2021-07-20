import React, { useContext } from 'react';

import { useSelector } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '../../store/reducers/SwipeView';

import { isAnimationModeOnSelector } from '../../store/reducers/AnimationMode'

import {
    isGutterHideSelector,
    isSideBarHideSelector,
} from '../../store/reducers/UI';

import Sidebar from './Sidebar';
import { AppContext } from '../../contexts/AppContextProvider';

import {
    SidebarToggleBtn,
    AppTitleText,
    BarChart,
    Title4ActiveItem,
    ShowLocalChangesCheckboxToggle,
    ListView
} from '../'

import { MobileHide, Spacing } from '../SharedUI';

const MainContent:React.FC = ()=>{
    return (
        <>
            <Spacing paddingLeft="1rem" paddingRight="1rem">
                <BarChart />

                <Title4ActiveItem />

                <ShowLocalChangesCheckboxToggle />
            </Spacing>

            <ListView />
        </>
    )
}

const AnimatorControls:React.FC = ()=>{
    return (
        <>
            <div 
                style={{
                    padding: '0 1rem',
                    marginTop: '.5rem'
                }}
            >
                <div className='btn btn-fill'>Download GIF</div>

                <div className='leader-half'>
                    <span className="font-size--2">
                        Animation Frames
                    </span>
                </div>
            </div>
        </>
    )
}

const SidebarContainer: React.FC = ({ children }) => {
    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const isHide = useSelector(isSideBarHideSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    return (
        <Sidebar
            isHide={isHide || isSwipeWidgetOpen}
            isGutterHide={isGutterHide}
            isMobile={isMobile}
        >
            <SidebarToggleBtn />

            <MobileHide>
                <AppTitleText />
            </MobileHide>

            { isAnimationModeOn ? <AnimatorControls /> : <MainContent /> }
        </Sidebar>
    );
};

export default SidebarContainer;
