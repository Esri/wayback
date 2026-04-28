/* Copyright 2024 Esri
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
