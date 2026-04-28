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

import { AppContext } from '@contexts/AppContextProvider';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { selectMapMode } from '@store/Map/reducer';
import { ModeToggleButton } from '@components/Gutter/ModeToggleButton';
import { useTranslation } from 'react-i18next';
import { activeDialogSelector } from '@store/UI/reducer';
import { updateMapMode } from '@store/Map/thunks';
// import { toggleUpdatesMode } from '@store/UpdatesMode/thunks';

export const UpdatesModeToggleButton = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    const activeDialog = useAppSelector(activeDialogSelector);

    const isActive = useMemo(
        () => mode === 'updates' && !activeDialog,
        [mode, activeDialog]
    );

    if (isMobile) {
        return null;
    }

    return (
        <ModeToggleButton
            isActive={isActive}
            tooltip={t('open_updates_mode')}
            label={t('open_updates_mode')}
            icon="date-time"
            testId="updates-mode-toggle-btn"
            onClick={() => dispatch(updateMapMode('updates'))}
        />
    );
};
