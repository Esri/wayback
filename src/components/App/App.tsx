import React from 'react'

import MapViewWrapper from '../MapViewWrapper/MapViewWrapper';
import Sidebar from '../Sidebar/SidebarContainer';
import AboutThisApp from '../ModalAboutApp/AboutThisAppContainer';
import SaveAsWebmapBtn from '../SaveAsWebmapBtn/SaveAsWebmapBtnContainer';
import SaveAsWebMapDialog from '../SaveAsWebmapDialog/SaveAsWebmapDialogContainer';
import MobileHeader from '../MobileHeader/MobileHeaderContainer';
import MobileFooter from '../MobileFooter/MobileFooterContainer';
import SettingDialog from '../SettingDialog/SettingDialogContainer';
import Gutter from '../Gutter/GutterContainer';
import ShareDialog from '../ShareDialog/ShareDialogContainer';
import SwipeWidgetToggleBtn from '../SwipeWidgetToggleBtn/SwipeWidgetToggleBtnContainer';

const App = () => {
    return (
        <>
            <MobileHeader />

            <Gutter>
                <SaveAsWebmapBtn />

                <SwipeWidgetToggleBtn />

            </Gutter>

            <Sidebar />

            <MapViewWrapper />

            <SaveAsWebMapDialog />

            <SettingDialog />

            <ShareDialog />

            <AboutThisApp />

            <MobileFooter />
        </>
    )
}

export default App
