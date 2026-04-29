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

import React, { useContext, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@store/configureStore';

import { releaseNum4SelectedItemsSelector } from '@store/Wayback/reducer';
import { SaveAsWebmapBtn } from './SaveDialogToggleButton';
import { selectIsSaveWebmapModeOn } from '@store/Map/reducer';
import { updateMapMode } from '@store/Map/thunks';
import { saveReleaseNumOfItemsToBeSaved2Webmap2SessionStorage } from '@utils/seesionStorage/sessionStorage';
import { activeDialogSelector } from '@store/UI/reducer';

export const SaveWebmapDialogToggleButtonContainer = () => {
    const dispatch = useAppDispatch();

    const rNum4SelectedWaybackItems: number[] = useAppSelector(
        releaseNum4SelectedItemsSelector
    );

    const isSaveWebmapModeOn = useAppSelector(selectIsSaveWebmapModeOn);

    const activeModal = useAppSelector(activeDialogSelector);

    const shouldHighlightButton = isSaveWebmapModeOn && !activeModal;

    useEffect(() => {
        saveReleaseNumOfItemsToBeSaved2Webmap2SessionStorage(
            rNum4SelectedWaybackItems
        );
    }, [rNum4SelectedWaybackItems]);

    return (
        <SaveAsWebmapBtn
            selectedWaybackItems={rNum4SelectedWaybackItems}
            // active={isSaveAsWebmapDialogOpen}
            active={shouldHighlightButton}
            // disabled={isDisabled}
            onClick={() => {
                dispatch(updateMapMode('save-webmap'));
            }}
            // clearAll={clearAllBtnOnClick}
        />
    );
};
