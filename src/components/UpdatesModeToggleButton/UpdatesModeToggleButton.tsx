import { AppContext } from '@contexts/AppContextProvider';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { mapModeChanged, selectMapMode } from '@store/Map/reducer';
import { ModeToggleButton } from '@components/ModeToggleButton';

export const UpdatesModeToggleButton = () => {
    const dispatch = useAppDispatch();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    const isActive = useMemo(() => mode === 'updates', [mode]);

    if (isMobile) {
        return null;
    }

    return (
        <ModeToggleButton
            isActive={isActive}
            tooltip="Open Updates Mode"
            icon="date-time"
            testId="updates-mode-toggle-btn"
            onClick={() => dispatch(mapModeChanged('updates'))}
        />
        // Uncomment the following code if you want to use a custom div instead of ModeToggleButton
        // <div
        //     data-testid="updates-mode-toggle-button"
        //     className={classNames(
        //         'relative w-full cursor-pointer mt-3 text-center flex items-center justify-center py-2',
        //         {
        //             'opacity-50': !isActive,
        //             'text-white': isActive,
        //             'bg-custom-background': isActive,
        //         }
        //     )}
        //     onClick={() => {
        //         dispatch(mapModeChanged('updates'));
        //     }}
        //     title="Toggle updates Mode"
        // >
        //     <calcite-icon icon="date-time" scale="l" />
        // </div>
    );
};
