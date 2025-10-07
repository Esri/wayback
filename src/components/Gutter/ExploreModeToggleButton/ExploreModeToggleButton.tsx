import { AppContext } from '@contexts/AppContextProvider';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { selectMapMode } from '@store/Map/reducer';
import { ModeToggleButton } from '@components/Gutter/ModeToggleButton';
import { activeDialogSelector } from '@store/UI/reducer';
import { updateMapMode } from '@store/Map/thunks';
import { useTranslation } from 'react-i18next';

export const ExploreModeToggleButton = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    const activeDialog = useAppSelector(activeDialogSelector);

    const isActive = useMemo(
        () => !activeDialog && mode === 'explore',
        [mode, activeDialog]
    );

    if (isMobile) {
        return null;
    }

    return (
        <ModeToggleButton
            isActive={isActive}
            tooltip={t('open_explore_mode')}
            label={t('open_explore_mode')}
            icon="list-button"
            testId="explore-mode-toggle-btn"
            onClick={() => dispatch(updateMapMode('explore'))}
        />
    );
};
