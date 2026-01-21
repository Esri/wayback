import {
    CalciteButton,
    CalciteLabel,
    CalciteOption,
    CalciteSelect,
} from '@esri/calcite-components-react';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { useAppSelector } from '@store/configureStore';
import { selectAppLanguage } from '@store/UI/reducer';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    /**
     * The currently selected language code
     */
    appLanguage: string;
    /**
     * The available locale data
     */
    data: {
        code: string;
        label: string;
    }[];
    appLanguageOnChange: (locale: string) => void;

    /**
     * Emits when the locale switcher is closed
     * @returns
     */
    onClose: () => void;
};

export const LocaleSwitcherDialog: FC<Props> = ({
    appLanguage,
    data,
    appLanguageOnChange,
    onClose,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    const [selectedLocale, setSelectedLocale] =
        React.useState<string>(appLanguage);

    useOnClickOutside(ref, () => {
        // console.log('LocaleSwitcher clicked outside');
        onClose();
    });

    return (
        <div
            ref={ref}
            className="w-72 background-theme-blue-diagonal-pattern text-white shadow-lg rounded-md py-2 px-3"
            data-testid="locale-switcher-dialog"
            style={{
                '--calcite-color-text-inverse': 'var(--default-text-color)',
            }}
        >
            <div className="w-full p-1 flex items-center justify-between">
                <h4>{t('choose_language')}</h4>

                <CalciteButton
                    data-testid="close-locale-switcher-dialog-button"
                    appearance="transparent"
                    kind="inverse"
                    iconStart="x"
                    scale="s"
                    onClick={() => {
                        onClose();
                    }}
                    label={t('close')}
                ></CalciteButton>
            </div>
            <CalciteSelect
                onCalciteSelectChange={(event) => {
                    const selected = event.target.selectedOption;
                    setSelectedLocale(selected.value);
                }}
                scale="s"
                value={selectedLocale}
                // value={selectedLocale}
            >
                {data.map((locale) => {
                    return (
                        <CalciteOption
                            key={locale.code}
                            value={locale.code}
                            selected={selectedLocale === locale.code}
                        >
                            {locale.label}
                        </CalciteOption>
                    );
                })}
            </CalciteSelect>

            <div className="mt-2 flex gap-2">
                <div className="w-1/2">
                    <CalciteButton
                        scale={'s'}
                        disabled={selectedLocale === appLanguage}
                        appearance="outline"
                        width="full"
                        kind="inverse"
                        label={t('switch_language')}
                        onClick={() => {
                            appLanguageOnChange(selectedLocale);
                        }}
                    >
                        {t('switch_language')}
                    </CalciteButton>
                </div>

                <div className="w-1/2">
                    <CalciteButton
                        scale={'s'}
                        appearance="outline"
                        kind="inverse"
                        width="full"
                        label={t('cancel')}
                        onClick={() => {
                            onClose();
                        }}
                    >
                        {t('cancel')}
                    </CalciteButton>
                </div>
            </div>
        </div>
    );
};
