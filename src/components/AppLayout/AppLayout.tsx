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
    Gutter,
    MapView,
    MapViewWrapper,
    MetadataPopup,
    MetadataQueryTask,
    MobileFooter,
    ReferenceLayer,
    ReferenceLayerToggle,
    Sidebar,
    SearchWidget,
    SwipeWidget,
    SaveAsWebMapDialog,
    SettingDialog,
    SwipeWidgetLayerSelector,
    TilePreviewWindow,
    WaybackLayer,
    ZoomWidget,
    DownloadDialog,
} from '..';
// import { AppContext } from '@contexts/AppContextProvider';
import { getArcGISOnlinePortalUrl } from '@utils/Tier';
import { AnimationLayer } from '@components/AnimationLayer/AnimationLayer';
import { useSaveAppState2URLHashParams } from '@hooks/useSaveAppState2URLHashParams';
import { useRevalidateToken } from '@hooks/useRevalidateToken';
import { Notification } from '@components/Notification';

import { AppHeader } from '@components/AppHeader';

import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { WorldImageryUpdatesLayers } from '@components/WorldImageryUpdatesLayers';
import { ProfileCard } from '@components/UserAccount';

const AppLayout: React.FC = () => {
    useSaveAppState2URLHashParams();

    useRevalidateToken();

    return (
        <ErrorBoundary>
            <AppHeader />

            <Gutter />

            <Sidebar />

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
                        portalUrl={getArcGISOnlinePortalUrl()}
                        // position={'top-left'}
                    />

                    <ZoomWidget />

                    <Notification />

                    <WorldImageryUpdatesLayers />
                </MapView>

                <SwipeWidgetLayerSelector targetLayer="trailing" />
            </MapViewWrapper>

            <SaveAsWebMapDialog />

            <SettingDialog />

            <DownloadDialog />

            <ProfileCard />

            <AboutThisApp />

            <MobileFooter />
        </ErrorBoundary>
    );
};

export default AppLayout;
