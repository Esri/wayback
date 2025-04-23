/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { DownloadJob, DownloadJobStatus } from '@store/DownloadMode/reducer';
import { numberFns } from 'helper-toolkit-ts';
import { MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import { CalciteIcon, CalciteLoader } from '@esri/calcite-components-react';

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
    pending: 'in progress',
    finished: 'donwload',
    failed: 'failed',
    downloaded: 'CHECK BROWSER FOR DOWNLOAD PROGRESS',
};

export const DownloadJobCard: FC<Props> = ({
    data,
    createTilePackageButtonOnClick,
    downloadTilePackageButtonOnClick,
    removeButtonOnClick,
    levelsOnChange,
}) => {
    const sliderRef = React.useRef<any>(null);

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
        return (
            <CalciteIcon
                icon="x"
                scale="s"
                style={{
                    cursor: 'pointer',
                }}
                title="Cancel"
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
            return `Tiles Ready to Download - ${sizeInMB}MB`;
        }

        return ButtonLableByStatus[status] || status;
    };

    /**
     * get formatted total number of title. Use comma separated if total is less than 1 million,
     * otherwise, use abbreviation instead
     * @param total
     * @returns
     */
    const formatTotalNumOfTiles = (total: number) => {
        if (!total) {
            return 0;
        }

        if (total < 1e6) {
            return numberFns.numberWithCommas(total);
        }

        return numberFns.abbreviateNumber(total);
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

        if (
            status === 'not started' &&
            totalTiles > MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT
        ) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        sliderRef.current.addEventListener(
            'calciteSliderChange',
            (evt: any) => {
                const userSelectedMinZoomLevel = +evt.target.minValue;
                const userSelectedMaxZoomLevel = +evt.target.maxValue;
                // console.log(evt.target.minValue,evt.target.maxValue)

                levelsOnChange(id, [
                    userSelectedMinZoomLevel,
                    userSelectedMaxZoomLevel,
                ]);
            }
        );
    }, []);

    if (!data) {
        return null;
    }

    return (
        <div className="w-full flex items-stretch">
            <div className="flex items-center mr-4 bg-white bg-opacity-10 py-1 pl-4 pr-2 flex-grow">
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
                        // value={levels[1]}
                        min-value={levels[0]}
                        max-value={levels[1]}
                        step="1"
                        ticks="1"
                        {...sliderProp}
                    ></calcite-slider>
                </div>

                <div className="text-sm text-white w-[96px] shrink-0">
                    <div className="leading-none mb-[2px]">
                        <span>
                            Level {levels[0]} - {levels[1]}
                        </span>
                    </div>

                    <div className="leading-none">
                        <span>~{formatTotalNumOfTiles(totalTiles)} tiles</span>
                    </div>
                </div>
            </div>

            <div
                className={classnames(
                    'flex justify-center items-center w-52  bg-custom-theme-blue text-white text-center cursor-pointer shrink-0',
                    {
                        disabled: shouldDisableActionButton(),
                    }
                )}
                onClick={buttonOnClickHandler}
            >
                {status === 'pending' && (
                    <CalciteLoader scale="s" inline></CalciteLoader>
                )}
                <span className="uppercase">{getButtonLable()}</span>
            </div>
        </div>
    );
};
