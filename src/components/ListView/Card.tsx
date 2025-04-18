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

import React, { FC, useContext } from 'react';
import classnames from 'classnames';

import { IWaybackItem, IStaticTooltipData } from '@typings/index';
import { getArcGISOnlinePortalUrl } from '@utils/Tier';
import { AppContext } from '@contexts/AppContextProvider';

interface Props {
    data: IWaybackItem;
    isActive: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    /**
     * if true, download button should be disabled
     */
    shouldDownloadButtonBeDisabled?: boolean;
    /**
     * tooltip text for download button
     */
    downloadButtonTooltipText: string;
    toggleSelect?: (releaseNum: number) => void;
    onClick?: (releaseNum: number) => void;
    downloadButtonOnClick: (releaseNum: number) => void;
    onMouseEnter?: (
        releaseNum: number,
        shouldShowPreviewItemTitle: boolean
    ) => void;
    onMouseOut?: () => void;
    toggleTooltip?: (data?: IStaticTooltipData) => void;
}

// interface IState {}

const ButtonWrapperClassnames = `relative h-full items-center px-2 cursor-pointer text-white`;

export const ListViewCard: FC<Props> = ({
    data,
    isActive,
    isSelected,
    isHighlighted,
    shouldDownloadButtonBeDisabled,
    downloadButtonTooltipText,
    onClick,
    onMouseEnter,
    onMouseOut,
    toggleSelect,
    downloadButtonOnClick,
}: Props) => {
    const { isMobile } = useContext(AppContext);

    const showControlButtons = isActive || isSelected;

    const openItem = () => {
        const itemId = data.itemID;

        const agolHost = getArcGISOnlinePortalUrl();

        const itemUrl = `${agolHost}/home/item.html?id=${itemId}`;

        window.open(itemUrl, '_blank');
    };

    return (
        <div
            className="py-1"
            onMouseEnter={onMouseEnter.bind(this, data.releaseNum, false)}
            onMouseLeave={onMouseOut}
            // this "data-testid" and "data-release-num" attributes will be used by the script
            // that monitors the health of this app
            data-testid={`list-card-${data.releaseNum}`}
            data-release-num={data.releaseNum}
        >
            <div
                className={classnames('list-card group', {
                    // 'is-active' indicates if is viewing this release on map
                    'is-active': isActive,
                    // 'is-highlighted' indicates if this release has local change
                    'is-highlighted': isHighlighted,
                    // 'is-selected' indicates if this release is being selected
                    'is-selected': isSelected,
                })}
            >
                <div
                    className="is-flexy cursor-pointer"
                    onClick={onClick.bind(this, data.releaseNum)}
                >
                    <a
                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                        // onClick={onClick.bind(this, data.releaseNum)}
                    >
                        {data.releaseDateLabel}
                    </a>
                </div>

                <div
                    className={classnames(ButtonWrapperClassnames, {
                        flex: showControlButtons,
                        'hidden group-hover:flex': !showControlButtons,
                    })}
                    onClick={openItem}
                    title="Learn more about this release..."
                >
                    <calcite-icon icon="information" scale="m" />
                </div>

                {/* The download and save web map buttons should not be displayed in mobile view */}
                {isMobile === false && (
                    <>
                        <div
                            className={classnames(ButtonWrapperClassnames, {
                                flex: showControlButtons,
                                'hidden group-hover:flex': !showControlButtons,
                                'cursor-default opacity-50':
                                    shouldDownloadButtonBeDisabled,
                            })}
                            onClick={() => {
                                if (shouldDownloadButtonBeDisabled) {
                                    return;
                                }

                                downloadButtonOnClick(data.releaseNum);
                            }}
                            title={downloadButtonTooltipText}
                        >
                            <calcite-icon icon="download-to" scale="m" />
                        </div>

                        <div
                            className={classnames(ButtonWrapperClassnames, {
                                flex: showControlButtons,
                                'hidden group-hover:flex': !showControlButtons,
                                'bg-white bg-opacity-20': isSelected,
                            })}
                            onClick={toggleSelect.bind(this, data.releaseNum)}
                            title={
                                isSelected
                                    ? 'Remove this release from your ArcGIS Online Map'
                                    : 'Add this release to an ArcGIS Online Map'
                            }
                        >
                            <calcite-icon icon="arcgis-online" scale="m" />
                        </div>
                    </>
                )}

                {/* <div
                    className="add-to-webmap-btn cursor-pointer"
                    // onMouseOver={this.showTooltip}
                    // onMouseOut={this.hideTooltip}
                    onClick={toggleSelect.bind(this, data.releaseNum)}
                    title={tooltipContentAdd2WebmapBtn}
                ></div> */}
            </div>
        </div>
    );
};
