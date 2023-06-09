import React, { useContext } from 'react';

import { useSelector } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

import { isGutterHideSelector, isSideBarHideSelector } from '@store/UI/reducer';

import Sidebar from './Sidebar';
import { AppContext } from '@contexts/AppContextProvider';

import {
    SidebarToggleBtn,
    AppTitleText,
    BarChart,
    Title4ActiveItem,
    ShowLocalChangesCheckboxToggle,
    ListView,
    AnimationControls,
} from '../';

import { MobileHide } from '../MobileVisibility';

type Props = {
    children?: React.ReactNode;
};

const SidebarContainer: React.FC<Props> = ({ children }) => {
    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const isHide = useSelector(isSideBarHideSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    const getContent = () => {
        if (isAnimationModeOn) {
            return <AnimationControls />;
        }

        return (
            <>
                <div className="mx-4">
                    <BarChart />

                    <ShowLocalChangesCheckboxToggle />

                    <Title4ActiveItem />
                </div>

                <ListView />
            </>
        );
    };

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

            {getContent()}
        </Sidebar>
    );
};

export default SidebarContainer;
