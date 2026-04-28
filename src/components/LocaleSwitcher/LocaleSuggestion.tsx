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

import {
    CalciteButton,
    CalciteCheckbox,
    CalciteIcon,
    CalciteLabel,
} from '@esri/calcite-components-react';
import React, { FC, useEffect, useMemo } from 'react';

type LocaleSuggestionProps = {
    /**
     * The suggested locale code
     */
    suggestedLocale: string;
    /**
     * Emits when the user accepts the locale switch suggestion
     * @returns
     */
    onAccept: () => void;
    /**
     * Emits when the locale suggestion is closed
     * @returns
     */
    onClose: () => void;
    /**
     * Emits when the user disables future locale suggestions
     * @returns
     */
    onDisableSuggestion: (shouldDisable: boolean) => void;
};

type LocaleSwitcherStringsByLocale = {
    [locale: string]: {
        switch_language: string;
        cancel: string;
        locale_switcher_suggestion_message: string;
        do_not_show_again: string;
    };
};

const localeSwitcherStringsByLocale: LocaleSwitcherStringsByLocale = {
    en: {
        switch_language: 'Switch Language',
        cancel: 'Cancel',
        locale_switcher_suggestion_message:
            'The app is available in English. Would you like to switch?',
        do_not_show_again: "Don't show this message again",
    },
    es: {
        switch_language: 'Cambiar idioma',
        cancel: 'Cancelar',
        locale_switcher_suggestion_message:
            'La aplicación está disponible en español. ¿Desea cambiar?',
        do_not_show_again: 'No volver a mostrar este mensaje',
    },
    zh: {
        switch_language: '切换语言',
        cancel: '取消',
        locale_switcher_suggestion_message: '该应用程序提供中文。您想切换吗？',
        do_not_show_again: '不再显示此消息',
    },
};

export const LocaleSuggestion: FC<LocaleSuggestionProps> = ({
    suggestedLocale,
    onAccept,
    onClose,
    onDisableSuggestion,
}) => {
    const [shouldDisableSuggestion, setShouldDisableSuggestion] =
        React.useState<boolean>(false);

    useEffect(() => {
        onDisableSuggestion(shouldDisableSuggestion);
    }, [shouldDisableSuggestion, onDisableSuggestion]);

    /**
     * Get strings for the suggested locale or fallback to English
     */
    const strings = useMemo(() => {
        return (
            localeSwitcherStringsByLocale[suggestedLocale] ||
            localeSwitcherStringsByLocale['en']
        );
    }, [suggestedLocale]);

    return (
        <div className="bg-custom-background text-white rounded-md shadow-lg pointer-events-auto max-w-lg">
            <div className="py-4 px-6">
                <div className="mb-2 flex items-center">
                    <p className="">
                        {strings.locale_switcher_suggestion_message}
                    </p>
                </div>

                <div className="text-sm mb-1">
                    <CalciteLabel layout="inline">
                        <CalciteCheckbox
                            checked={shouldDisableSuggestion}
                            onCalciteCheckboxChange={() => {
                                // onDisableSuggestion();
                                setShouldDisableSuggestion(
                                    !shouldDisableSuggestion
                                );
                            }}
                        />
                        <span className="text-sm">
                            {strings.do_not_show_again}
                        </span>
                    </CalciteLabel>
                </div>

                <div className="flex gap-2">
                    <div className="w-1/2">
                        <CalciteButton
                            appearance="outline"
                            kind="neutral"
                            width="full"
                            iconEnd="x"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            {strings.cancel}
                        </CalciteButton>
                    </div>
                    <div className="w-1/2">
                        <CalciteButton
                            appearance="outline"
                            kind="neutral"
                            width="full"
                            iconEnd="language-translate"
                            onClick={() => {
                                onAccept();
                            }}
                        >
                            {strings.switch_language}
                        </CalciteButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
