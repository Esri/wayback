import React, { FC } from 'react';
import classnames from 'classnames';
import { DownloadJob } from '@store/DownloadMode/reducer';

type Props = {
    data: DownloadJob;
};

export const DonwloadJob: FC<Props> = ({ data }) => {
    const { waybackItem, levels, totalTiles, status } = data || {};

    const getStatusIcon = () => {
        if (status === 'pending') {
            return <calcite-loader scale="s" inline></calcite-loader>;
        }

        if (status === 'finished') {
            return <calcite-icon icon="check" scale="s" />;
        }

        return null;
    };

    const getButtonLable = () => {
        if (status === 'pending') {
            return 'in progress...';
        }

        if (status === 'finished') {
            return 'download';
        }

        return 'create tile package';
    };

    if (!data) {
        return null;
    }

    return (
        <div className="w-full flex items-stretch">
            <div className="flex items-center mr-4 bg-white bg-opacity-10 py-1 px-4 flex-grow">
                <div className="w-4 text-white mr-2 flex items-center">
                    {getStatusIcon()}
                </div>

                <div className="mr-4">
                    <span className="text-2xl text-custom-theme-blue">
                        {waybackItem.releaseDateLabel}
                    </span>
                </div>

                <div className="text-sm text-white">
                    <div className="leading-none mb-[2px]">
                        <span>
                            Level {levels[0]} - {levels[1]}
                        </span>
                    </div>

                    <div className="leading-none">
                        <span>~{totalTiles || 0} tiles</span>
                    </div>
                </div>
            </div>

            <div
                className={classnames(
                    'flex justify-center items-center w-52  bg-custom-theme-blue text-white cursor-pointer shrink-0',
                    {
                        disabled: status === 'pending',
                    }
                )}
            >
                <span className="uppercase">{getButtonLable()}</span>
            </div>
        </div>
    );
};
