import { AppContext } from '@contexts/AppContextProvider';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { mapModeChanged, selectMapMode } from '@store/Map/reducer';

export const ExploreModeToggleButton = () => {
    const dispatch = useAppDispatch();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    const isActive = useMemo(() => mode === 'explore', [mode]);

    if (isMobile) {
        return null;
    }

    return (
        <div
            data-testid="explore-mode-toggle-button"
            className={classNames(
                'relative w-full cursor-pointer mt-3 text-center flex items-center justify-center py-2',
                {
                    'opacity-50': !isActive,
                    'text-white': isActive,
                    'bg-custom-background': isActive,
                }
            )}
            onClick={() => {
                dispatch(mapModeChanged('explore'));
            }}
            title="Open Explore Mode"
        >
            <calcite-icon icon="list-button" scale="l" />
        </div>
    );
};
