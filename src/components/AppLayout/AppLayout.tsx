import React from 'react'

import {
    AboutThisApp,
    AppTitleText,
    BarChart,
    Gutter,
    ListView,
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
    SidebarToggleBtn,
    SwipeWidgetLayerSelector,
    ShowLocalChangesCheckboxToggle,
    TilePreviewWindow,
    Title4ActiveItem,
    WaybackLayer
} from '..'

import {
    MobileHide,
    Spacing
} from '../SharedUI'

const AppLayout = () => {
    return (
        <>
            <MobileHeader />

            <Gutter>

                <SaveAsWebmapBtn />

                <SwipeWidgetToggleBtn />

            </Gutter>

            <Sidebar>

                <SidebarToggleBtn />

                <Spacing
                    paddingLeft='1rem'
                    paddingRight='1rem'
                >
                    <MobileHide>
                        <AppTitleText />
                    </MobileHide>
                    
                    <BarChart />

                    <Title4ActiveItem />

                    <ShowLocalChangesCheckboxToggle />

                </Spacing>

                <ListView />

            </Sidebar>

            <MapViewWrapper>

                <SwipeWidgetLayerSelector 
                    targetLayer='leading'
                />

                <MapView>

                    <WaybackLayer/>

                    <ReferenceLayer/>

                    <SearchWidget 
                        position={'top-left'}
                    />

                    <TilePreviewWindow />

                    <MetadataPopup />

                    <MetadataQueryTask />

                    <SwipeWidget />

                    <ReferenceLayerToggle /> 

                </MapView>
                
                <SwipeWidgetLayerSelector 
                    targetLayer='trailing'
                />

            </MapViewWrapper>

            <SaveAsWebMapDialog />

            <SettingDialog />

            <ShareDialog />

            <AboutThisApp />

            <MobileFooter />
        </>
    )
}

export default AppLayout
