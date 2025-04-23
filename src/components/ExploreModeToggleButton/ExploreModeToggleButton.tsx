import { AppContext } from '@contexts/AppContextProvider';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { mapModeChanged, selectMapMode } from '@store/Map/reducer';
import { ModeToggleButton } from '@components/ModeToggleButton';

export const ExploreModeToggleButton = () => {
    const dispatch = useAppDispatch();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    const isActive = useMemo(() => mode === 'explore', [mode]);

    if (isMobile) {
        return null;
    }

    return (
        <ModeToggleButton
            isActive={isActive}
            tooltip="Open Explore Mode"
            icon="list-button"
            testId="explore-mode-toggle-btn"
            onClick={() => dispatch(mapModeChanged('explore'))}
        />
    );
};
