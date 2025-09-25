import { AppContext } from '@contexts/AppContextProvider';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { selectMapMode } from '@store/Map/reducer';
import { ModeToggleButton } from '@components/ModeToggleButton';
import { useTranslation } from 'react-i18next';
import { activeDialogSelector } from '@store/UI/reducer';
import { updateMapMode } from '@store/Map/thunks';

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
            icon="date-time"
            testId="updates-mode-toggle-btn"
            onClick={() => dispatch(updateMapMode('updates'))}
        />
    );
};
