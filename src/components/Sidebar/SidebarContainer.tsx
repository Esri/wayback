/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useContext } from 'react';

import { useAppSelector } from '@store/configureStore';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

import { isGutterHideSelector, isSideBarHideSelector } from '@store/UI/reducer';

import Sidebar from './Sidebar';
import { AppContext } from '@contexts/AppContextProvider';

import {
    SidebarToggleBtn,
    BarChart,
    Title4ActiveItem,
    ShowLocalChangesCheckboxToggle,
    ListView,
    AnimationControls,
} from '../';
import { selectMapMode } from '@store/Map/reducer';
import { UpdatesInfo } from '@components/UpdatesPanel';

// import { MobileHide } from '../MobileVisibility';

type Props = {
    children?: React.ReactNode;
};

const SidebarContainer: React.FC<Props> = ({ children }) => {
    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);

    const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    const mode = useAppSelector(selectMapMode);

    const isHide = useAppSelector(isSideBarHideSelector);

    const isGutterHide = useAppSelector(isGutterHideSelector);

    const getContent = () => {
        if (isAnimationModeOn) {
            return <AnimationControls />;
        }

        if (mode === 'updates') {
            return <UpdatesInfo />;
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
            {getContent()}
        </Sidebar>
    );
};

export default SidebarContainer;
