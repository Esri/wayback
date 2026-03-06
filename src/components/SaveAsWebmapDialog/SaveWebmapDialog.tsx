import { CalciteButton } from '@esri/calcite-components-react';
import { WaybackItem } from '@esri/wayback-core';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
    activeWaybackItem: WaybackItem;
    waybackItemsToSave: WaybackItem[];
    chooseActiveItemOnClick: (releaseNum: number) => void;
    clearAllSelectedItemsOnClick: () => void;
};
export const SaveWebmapDialog: FC<Props> = ({
    activeWaybackItem,
    waybackItemsToSave,
    chooseActiveItemOnClick,
    clearAllSelectedItemsOnClick,
}) => {
    const { t } = useTranslation();

    const getContent = () => {
        if (!waybackItemsToSave || waybackItemsToSave.length === 0) {
            return (
                <div className="text-white font-light text-sm">
                    <Trans
                        i18nKey="prompt_to_save_active_wayback_item_as_webmap"
                        values={{
                            waybackReleaseDate:
                                activeWaybackItem?.releaseDateLabel ||
                                'Unknown',
                        }}
                        components={{
                            action: (
                                <button
                                    className="font-semibold underline cursor-pointer text-custom-theme-blue-light"
                                    onClick={chooseActiveItemOnClick.bind(
                                        null,
                                        activeWaybackItem.releaseNum
                                    )}
                                />
                            ),
                        }}
                    />
                </div>
            );
        }

        return (
            <div>
                <CalciteButton onClick={clearAllSelectedItemsOnClick}>
                    {t('clear_all')}
                </CalciteButton>
            </div>
        );
    };

    return (
        <div className="bg-white bg-opacity-10 p-2 w-full mb-2">
            {getContent()}
        </div>
    );
};
