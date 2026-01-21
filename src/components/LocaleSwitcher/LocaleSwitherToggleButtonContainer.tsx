import React from 'react';
import { LocaleSwitherToggleButton } from './LocaleSwitherToggleButton';
import { useAppDispatch } from '@store/configureStore';
import { loacleSwitcherToggled } from '@store/UI/reducer';

export const LocaleSwitherToggleButtonContainer = () => {
    const dispatch = useAppDispatch();

    return (
        <LocaleSwitherToggleButton
            onClick={() => {
                // console.log('Locale switcher clicked')
                dispatch(loacleSwitcherToggled());
            }}
        />
    );
};
