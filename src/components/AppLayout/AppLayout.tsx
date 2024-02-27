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

import React, { useEffect } from 'react';

import {
    AboutThisApp,
    // AppTitleText,
    // BarChart,
    Gutter,
    // ListView,
    MapView,
    MapViewWrapper,
    MetadataPopup,
    MetadataQueryTask,
    MobileHeader,
    MobileFooter,
    ReferenceLayer,
    ReferenceLayerToggle,
    Sidebar,
    SearchWidget,
    // ShareDialog,
    SwipeWidget,
    SaveAsWebMapDialog,
    SwipeWidgetToggleBtn,
    SettingDialog,
    SaveAsWebmapBtn,
    // SidebarToggleBtn,
    SwipeWidgetLayerSelector,
    // ShowLocalChangesCheckboxToggle,
    TilePreviewWindow,
    // Title4ActiveItem,
    WaybackLayer,
    // AnimationPanel,
    AnimationModeToggleBtn,
    ZoomWidget,
    OpenDownloadPanelBtn,
    DownloadDialog,
} from '..';
// import { AppContext } from '@contexts/AppContextProvider';
import { getServiceUrl } from '@utils/Tier';
import useCurrenPageBecomesVisible from '@hooks/useCurrenPageBecomesVisible';
import { revalidateToken } from '@utils/Esri-OAuth';
import { AnimationLayer } from '@components/AnimationLayer/AnimationLayer';

const AppLayout: React.FC = () => {
    // const { onPremises } = React.useContext(AppContext);

    const currentPageIsVisibleAgain = useCurrenPageBecomesVisible();

    useEffect(() => {
        if (!currentPageIsVisibleAgain) {
            return;
        }

        // should re-validate when current tab becomes visible again,
        // so that we can sign out the current user if the token is no longer valid,
        // this can heppen when user signs out it's ArcGIS Online account from another tab
        revalidateToken();
    }, [currentPageIsVisibleAgain]);

    return (
        <>
            <MobileHeader />

            <Gutter>
                <SwipeWidgetToggleBtn />

                <AnimationModeToggleBtn />

                <OpenDownloadPanelBtn />

                <SaveAsWebmapBtn />
            </Gutter>

            <Sidebar></Sidebar>

            <MapViewWrapper>
                <SwipeWidgetLayerSelector targetLayer="leading" />

                <MapView>
                    <WaybackLayer />

                    <ReferenceLayer />

                    <TilePreviewWindow />

                    <MetadataPopup />

                    <MetadataQueryTask />

                    <SwipeWidget />

                    {/* <AnimationPanel /> */}
                    <AnimationLayer />

                    <ReferenceLayerToggle />

                    <SearchWidget
                        portalUrl={getServiceUrl('portal-url')}
                        // position={'top-left'}
                    />

                    <ZoomWidget />
                </MapView>

                <SwipeWidgetLayerSelector targetLayer="trailing" />
            </MapViewWrapper>

            <SaveAsWebMapDialog />

            <SettingDialog />

            {/* {!onPremises && <ShareDialog />} */}

            <DownloadDialog />

            <AboutThisApp />

            <MobileFooter />
        </>
    );
};

export default AppLayout;
