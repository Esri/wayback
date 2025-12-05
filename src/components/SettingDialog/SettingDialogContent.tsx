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

import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import {
    saveDefaultMapLocation,
    getCustomPortalUrl,
    setCustomPortalUrl,
} from '@utils/LocalStorage';
// import { IExtentGeomety } from '@typings/index';
import { Switch } from './Switch';
import { CalciteButton } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';
import { MapCenter } from '@store/Map/reducer';

interface IProps {
    mapCenterAndZoom: {
        center: MapCenter;
        zoom: number;
    };
}

const CustomUrlFromLocalStorage = getCustomPortalUrl();

const SettingDialogContent: React.FC<IProps> = ({ mapCenterAndZoom }) => {
    const { t } = useTranslation();

    const [portalUrl, setPortalUrl] = useState<string>(
        CustomUrlFromLocalStorage
    );

    const [shouldUseCustomPortalUrl, setShouldUseCustomPortalUrl] =
        useState<boolean>(CustomUrlFromLocalStorage ? true : false);

    const [shouldSaveAsDefaultMapLocation, setShouldSaveAsDefaultMapLocation] =
        useState<boolean>(false);

    const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

    const saveSettings = () => {
        if (shouldSaveAsDefaultMapLocation) {
            // saveDefaultExtent(mapExtent);
            saveDefaultMapLocation(
                mapCenterAndZoom.center,
                mapCenterAndZoom.zoom
            );
        }

        const customPortalUrl =
            shouldUseCustomPortalUrl && portalUrl ? portalUrl : null;

        setCustomPortalUrl(customPortalUrl);

        if (customPortalUrl !== CustomUrlFromLocalStorage) {
            window.location.reload();
        }

        setSettingsSaved(true);

        setTimeout(() => {
            setSettingsSaved(false);
        }, 2000);
    };

    // useEffect(() => {
    //     setShouldSaveAsDefaultExtent(false);
    // }, [mapExtent]);

    return (
        <>
            <div className="mt-2 mb-4">
                <Switch
                    label={t('save_map_extent')}
                    checked={shouldSaveAsDefaultMapLocation}
                    onChange={() =>
                        setShouldSaveAsDefaultMapLocation(
                            !shouldSaveAsDefaultMapLocation
                        )
                    }
                />
            </div>

            <div className="mt-2 mb-4">
                <Switch
                    label={t('save_custom_portal')}
                    checked={shouldUseCustomPortalUrl}
                    onChange={() =>
                        setShouldUseCustomPortalUrl(!shouldUseCustomPortalUrl)
                    }
                />

                {shouldUseCustomPortalUrl && (
                    <div className="mt-2">
                        <input
                            type="text"
                            className="w-full p-1 outline-none"
                            placeholder="https://<my-enterprise-url>/portal"
                            onChange={(evt) => {
                                setPortalUrl(evt?.currentTarget?.value || '');
                            }}
                            value={portalUrl || ''}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <div
                    className={classnames({
                        disabled:
                            !portalUrl && !setShouldSaveAsDefaultMapLocation,
                    })}
                    style={{
                        '--calcite-button-text-color': '#fff',
                    }}
                >
                    <CalciteButton onClick={saveSettings}>
                        {settingsSaved ? t('saved') : t('save')}
                    </CalciteButton>
                </div>
            </div>
        </>
    );
};

export default SettingDialogContent;
