import React from 'react';
import { useTranslation } from 'react-i18next';

export const UpdatesModeHeader = () => {
    const { t } = useTranslation();
    return (
        <div className="text-white font-light text-sm mb-2">
            <h4>{t('updates_mode_header')}</h4>
        </div>
    );
};
