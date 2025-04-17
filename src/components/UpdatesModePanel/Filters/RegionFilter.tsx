import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';

export const RegionFilter = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('region')} />
        </div>
    );
};
