import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    loacleSwitcherToggled,
    selectAppLanguage,
    selectIsLocaleSwitcherOpen,
} from '@store/UI/reducer';
import React from 'react';
import { LocaleSwitcherDialog } from './LocaleSwitcherDialog';
import { useLocaleOptions } from './useLocaleOptions';

export const LocaleSwitcherDialogContainer = () => {
    const dispatch = useAppDispatch();

    const isLoacleSwitcherOpen = useAppSelector(selectIsLocaleSwitcherOpen);

    const selectedLocale = useAppSelector(selectAppLanguage);

    const LocaleOption = useLocaleOptions();

    if (!isLoacleSwitcherOpen) {
        return null;
    }

    return (
        <div className="fixed left-gutter-width bottom-12 z-50 pl-2">
            <LocaleSwitcherDialog
                data={LocaleOption}
                selectedLocale={selectedLocale}
                setSelectedLocale={(locale: string) => {
                    console.log('Locale selected:', locale);
                    // dispatch action to change locale
                    // dispatch(
                    //     appLanguageChanged(locale)
                    // )
                }}
                onClose={() => {
                    dispatch(loacleSwitcherToggled());
                }}
            />
        </div>
    );
};
