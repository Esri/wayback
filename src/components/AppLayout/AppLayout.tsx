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
    ShareDialog,
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
    AnimationPanel,
    AnimationModeToggleBtn,
    ZoomWidget,
    OpenDownloadPanelBtn,
    DownloadDialog,
} from '..';
import { AppContext } from '@contexts/AppContextProvider';
import { getServiceUrl } from '@utils/Tier';
import useCurrenPageBecomesVisible from '@hooks/useCurrenPageBecomesVisible';
import { revalidateToken } from '@utils/Esri-OAuth';

const AppLayout: React.FC = () => {
    const { onPremises } = React.useContext(AppContext);

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

                    <AnimationPanel />

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

            {!onPremises && <ShareDialog />}

            <DownloadDialog />

            <AboutThisApp />

            <MobileFooter />
        </>
    );
};

export default AppLayout;
