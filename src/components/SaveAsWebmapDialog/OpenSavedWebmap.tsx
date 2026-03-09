import { CalciteButton } from '@esri/calcite-components-react';
import { getPortalBaseUrl } from '@utils/Esri-OAuth';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    itemId: string;
};

export const OpenSavedWebmap: FC<Props> = ({ itemId }) => {
    const { t } = useTranslation();

    const itemUrl = useMemo(() => {
        if (!itemId) {
            return '';
        }

        const portalBaseUrl = getPortalBaseUrl() || 'https://www.arcgis.com';

        return `${portalBaseUrl}/home/item.html?id=${itemId}`;
    }, [itemId]);

    if (!itemUrl) {
        return null;
    }

    return (
        <div className="text-white font-light text-sm bg-white bg-opacity-10 p-2 w-full mb-2">
            <p className="message-webamap-is-ready text-sm mb-2">
                {t('webmap_ready_message')}
            </p>
            <div>
                <CalciteButton
                    width="full"
                    label={t('open_wayback_map')}
                    data-testid="open-wayback-webmap-button"
                    href={itemUrl}
                    target="_blank"
                    iconEnd="launch"
                >
                    {t('open_wayback_map')}
                </CalciteButton>
            </div>
        </div>
    );
};
