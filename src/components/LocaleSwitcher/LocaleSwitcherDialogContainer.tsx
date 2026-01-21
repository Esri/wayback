import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    loacleSwitcherToggled,
    selectAppLanguage,
    selectIsLocaleSwitcherOpen,
} from '@store/UI/reducer';
import React from 'react';
import { LocaleSwitcherDialog } from './LocaleSwitcherDialog';
import { useLocaleOptions } from './useLocaleOptions';
import { setPreferredLocale } from '@utils/i18n/getAppLanguage';

export const LocaleSwitcherDialogContainer = () => {
    const dispatch = useAppDispatch();

    const isLoacleSwitcherOpen = useAppSelector(selectIsLocaleSwitcherOpen);

    const appLanguage = useAppSelector(selectAppLanguage);

    const LocaleOption = useLocaleOptions();

    if (!isLoacleSwitcherOpen) {
        return null;
    }

    return (
        <div className="fixed left-gutter-width bottom-2 z-50 pl-2">
            <LocaleSwitcherDialog
                data={LocaleOption}
                appLanguage={appLanguage}
                appLanguageOnChange={(locale: string) => {
                    setPreferredLocale(locale);
                }}
                onClose={() => {
                    dispatch(loacleSwitcherToggled());
                }}
            />
        </div>
    );
};
