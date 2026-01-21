import { CalciteIcon } from '@esri/calcite-components-react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
    onClick: () => void;
};
export const LocaleSwitherToggleButton: FC<Props> = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <div className="relative flex justify-center items-center w-full mb-3 cursor-pointer px-1">
            <button
                className={
                    'relative w-full flex justify-center items-center text-center py-1'
                }
                aria-label={t('switch_language')}
                title={t('switch_language')}
                onClick={onClick}
            >
                <CalciteIcon icon="language-2" scale="m" />
            </button>
        </div>
    );
};
