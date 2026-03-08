import { CalciteButton } from '@esri/calcite-components-react';
import { WaybackItem } from '@esri/wayback-core';
import classNames from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    activeWaybackItem: WaybackItem;
    waybackItemsToSave: WaybackItem[];
    setActiveWaybackItemOnClick: (releaseNum: number) => void;
    clearAllSelectedItemsOnClick: () => void;
    removeWaybackItemOnClick: (releaseNum: number) => void;
};

export const WebmapLayersList: FC<Props> = ({
    activeWaybackItem,
    waybackItemsToSave,
    setActiveWaybackItemOnClick,
    clearAllSelectedItemsOnClick,
    removeWaybackItemOnClick,
}) => {
    const { t } = useTranslation();

    if (!waybackItemsToSave || waybackItemsToSave.length === 0) {
        return null;
    }

    return (
        <div className="">
            <div className="flex items-center justify-between mb-1">
                <span className="text-white font-light text-sm">
                    {t('selected_layers')}
                </span>
                <CalciteButton
                    onClick={clearAllSelectedItemsOnClick}
                    appearance="transparent"
                    kind="neutral"
                    scale="s"
                >
                    {t('clear_all')}
                </CalciteButton>
            </div>

            {waybackItemsToSave.map((item) => (
                <div
                    key={item.releaseNum}
                    className={classNames(
                        'flex items-center justify-between bg-white bg-opacity-10 mb-2 px-2 py-1 border-l-4',
                        {
                            'border-white':
                                item.releaseNum ===
                                activeWaybackItem?.releaseNum,
                            'border-transparent':
                                item.releaseNum !==
                                activeWaybackItem?.releaseNum,
                        }
                    )}
                >
                    <button
                        onClick={setActiveWaybackItemOnClick.bind(
                            null,
                            item.releaseNum
                        )}
                    >
                        <span className="text-sm ml-1">
                            {item.releaseDateLabel || 'Unknown'}
                        </span>
                    </button>
                    <CalciteButton
                        appearance="transparent"
                        kind="neutral"
                        scale="s"
                        iconStart="x"
                        onClick={removeWaybackItemOnClick.bind(
                            null,
                            item.releaseNum
                        )}
                    />
                </div>
            ))}
        </div>
    );
};
