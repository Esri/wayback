import React, { FC, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { DownloadJob, DownloadJobStatus } from '@store/DownloadMode/reducer';
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

const ButtonLableByStatus: Record<DownloadJobStatus, string> = {
    'not started': 'create tile package',
    pending: 'in progress...',
    finished: 'donwload',
    failed: 'failed',
    downloaded: 'downloaded',
};

export const DownloadJobCard: FC<Props> = ({
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
        outputTilePackageInfo,
        // GPJobId
    } = data || {};

    const shouldSliderBeDisabled =
        maxZoomLevel === minZoomLevel || status !== 'not started';

    const sliderProp = shouldSliderBeDisabled ? { disabled: true } : {};

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

    const buttonOnClickHandler = () => {
        if (status === 'not started') {
            createTilePackageButtonOnClick(id);
        } else if (status === 'finished') {
            downloadTilePackageButtonOnClick(id);
        }
    };

    const getButtonLable = () => {
        if (status === 'finished' && outputTilePackageInfo !== undefined) {
            const sizeInMB = (outputTilePackageInfo.size / 1000000).toFixed(1);
            return `Download - ${sizeInMB}MB`;
        }

        return ButtonLableByStatus[status] || status;
    };

    const shouldDisableActionButton = () => {
        if (
            status === 'pending' ||
            status === 'failed' ||
            status === 'downloaded'
        ) {
            return true;
        }

        if (status === 'finished' && !outputTilePackageInfo) {
            return true;
        }

        return false;
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
                        max={
                            maxZoomLevel === minZoomLevel
                                ? maxZoomLevel + 1
                                : maxZoomLevel
                        }
                        min={minZoomLevel}
                        value={levels[1]}
                        step="1"
                        ticks="1"
                        {...sliderProp}
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
                        disabled: shouldDisableActionButton(),
                    }
                )}
                onClick={buttonOnClickHandler}
            >
                <span className="uppercase">{getButtonLable()}</span>
            </div>
        </div>
    );
};
