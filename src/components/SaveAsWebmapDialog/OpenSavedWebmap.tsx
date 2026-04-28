/* Copyright 2024-2026 Esri
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

import { CalciteButton } from '@esri/calcite-components-react';
import { useAppDispatch } from '@store/configureStore';
import { getPortalBaseUrl } from '@utils/Esri-OAuth';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    itemId: string;
    /**
     * Emits after user clicks the button to open the created webmap in new tab. This will trigger the action to clear selected wayback items.
     * @returns
     */
    onWebmapOpened: () => void;
};

export const OpenSavedWebmap: FC<Props> = ({ itemId, onWebmapOpened }) => {
    const { t } = useTranslation();

    const itemUrl = useMemo(() => {
        if (!itemId) {
            return '';
        }

        const portalBaseUrl = getPortalBaseUrl() || 'https://www.arcgis.com';

        return `${portalBaseUrl}/home/item.html?id=${itemId}`;
    }, [itemId]);

    const openWebmapInNewTab = () => {
        if (!itemUrl) {
            return;
        }

        window.open(itemUrl, '_blank');

        onWebmapOpened();
    };

    if (!itemUrl) {
        return null;
    }

    return (
        <div className="text-white font-light text-sm bg-white bg-opacity-10 p-2 w-full mb-2">
            <p className="message-webamap-is-ready text-sm mb-2">
                {t('webmap_ready_message')}
            </p>
            <div>
                <CalciteButton
                    width="full"
                    label={t('open_wayback_map')}
                    data-testid="open-wayback-webmap-button"
                    iconEnd="launch"
                    onClick={openWebmapInNewTab}
                >
                    {t('open_wayback_map')}
                </CalciteButton>
            </div>
        </div>
    );
};
