import React, { FC, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { DownloadJob } from '@store/DownloadMode/reducer';
import { numberFns } from 'helper-toolkit-ts';

type Props = {
    data: DownloadJob;
    /**
     * fires when user clicks on the create tile package button to start the download job
     * @param id download job id
     * @returns
     */
    createTilePackageButtonOnClick: (id: string) => void;
    /**
     * fires when user clicks on the download tile package button
     * @param id download job id
     * @returns
     */
    downloadTilePackageButtonOnClick: (gpJobId: string) => void;
    /**
     * fires when user clicks on the remove button to delete the download job
     * @param id job id
     * @returns void
     */
    removeButtonOnClick: (id: string) => void;
    /**
     * fires when user makes changes to the selected zoom levels using the slider
     * @param levels
     * @returns void
     */
    levelsOnChange: (id: string, levels: number[]) => void;
};

export const DonwloadJob: FC<Props> = ({
    data,
    createTilePackageButtonOnClick,
    downloadTilePackageButtonOnClick,
    removeButtonOnClick,
    levelsOnChange,
}) => {
    const sliderRef = React.useRef<any>();

    const {
        id,
        waybackItem,
        levels,
        status,
        minZoomLevel,
        maxZoomLevel,
        tileEstimations,
        // GPJobId
    } = data || {};

    const totalTiles = useMemo(() => {
        if (!tileEstimations || !tileEstimations.length) {
            return 0;
        }

        let total = 0;

        const [minZoom, maxZoom] = levels;

        for (const { count, level } of tileEstimations) {
            if (level < minZoom) {
                continue;
            }

            if (level > maxZoom) {
                break;
            }

            total += count;
        }

        return total;
    }, [tileEstimations, levels]);

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

    const buttonOnClickHandler = () => {
        if (status === 'not started') {
            createTilePackageButtonOnClick(id);
        } else if (status === 'finished') {
            downloadTilePackageButtonOnClick(id);
        }
    };

    useEffect(() => {
        sliderRef.current.addEventListener(
            'calciteSliderChange',
            (evt: any) => {
                const userSelectedMaxZoomLevel = +evt.target.value;

                levelsOnChange(id, [levels[0], userSelectedMaxZoomLevel]);
            }
        );
    }, []);

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
                        ref={sliderRef}
                        label-ticks
                        snap
                        max={maxZoomLevel}
                        min={minZoomLevel}
                        value={levels[1]}
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
                onClick={buttonOnClickHandler}
            >
                <span className="uppercase">{getButtonLable()}</span>
            </div>
        </div>
    );
};
