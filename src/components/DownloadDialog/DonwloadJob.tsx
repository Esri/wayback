import React, { FC, useMemo } from 'react';
import classnames from 'classnames';
import { DownloadJob } from '@store/DownloadMode/reducer';
import { numberFns } from 'helper-toolkit-ts';

type Props = {
    data: DownloadJob;
    /**
     * fires when user clicks on the remove button to delete the download job
     * @param id job id
     * @returns
     */
    removeButtonOnClick: (id: string) => void;
};

export const DonwloadJob: FC<Props> = ({ data, removeButtonOnClick }) => {
    const {
        id,
        waybackItem,
        levels,
        status,
        minZoomLevel,
        maxZoomLevel,
        tileEstimations,
    } = data || {};

    const totalTiles = useMemo(() => {
        if (!tileEstimations || !tileEstimations.length) {
            return 0;
        }

        let total = 0;

        for (const { count, level } of tileEstimations) {
            if (level < minZoomLevel) {
                continue;
            }

            if (level > maxZoomLevel) {
                break;
            }

            total += count;
        }

        return total;
    }, [tileEstimations, minZoomLevel, maxZoomLevel]);

    const getStatusIcon = () => {
        if (status === 'pending') {
            return <calcite-loader scale="s" inline></calcite-loader>;
        }

        if (status === 'finished') {
            return <calcite-icon icon="check" scale="s" />;
        }

        return (
            <calcite-icon
                icon="x"
                scale="s"
                style={{
                    cursor: 'pointer',
                }}
                onClick={removeButtonOnClick.bind(null, id)}
            />
        );
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

                <div className="">
                    <span className="text-2xl text-custom-theme-blue">
                        {waybackItem.releaseDateLabel}
                    </span>
                </div>

                <div className="flex-grow px-4">
                    <calcite-slider
                        label-ticks
                        snap
                        max={maxZoomLevel}
                        min={minZoomLevel}
                        value={maxZoomLevel}
                        step="1"
                        ticks="1"
                    ></calcite-slider>
                </div>

                <div className="text-sm text-white">
                    <div className="leading-none mb-[2px]">
                        <span>
                            Level {levels[0]} - {levels[1]}
                        </span>
                    </div>

                    <div className="leading-none">
                        <span>
                            ~{numberFns.numberWithCommas(totalTiles)} tiles
                        </span>
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
