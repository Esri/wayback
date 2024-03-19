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

import './style.css';
import React from 'react';

import { IWaybackItem, IStaticTooltipData } from '@typings/index';

import { ListViewCard as Card } from './Card';
import StaticTooltip from '../StaticTooltip';

interface IProps {
    isMobile: boolean;
    waybackItems: Array<IWaybackItem>;
    activeWaybackItem: IWaybackItem;
    shouldOnlyShowItemsWithLocalChange: boolean;
    rNum4SelectedWaybackItems: Array<number>;
    rNum4WaybackItemsWithLocalChanges: Array<number>;
    /**
     * if ture, the The donwload button will be disabled.
     * The download button should only be enabled if
     * - number of download jobs has not reached to the limit
     * - map zoom level is 12+
     */
    shouldDownloadButtonBeDisabled: boolean;
    /**
     * tooltip text for download button
     */
    downloadButtonTooltipText: string;
    toggleSelect?: (releaseNum: number) => void;
    onClick?: (releaseNum: number) => void;
    downloadButtonOnClick: (releaseNum: number) => void;
    onMouseEnter?: (releaseNum: number) => void;
    onMouseOut?: () => void;
}

interface IState {
    tooltipData: IStaticTooltipData;
}

class ListView extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            tooltipData: {
                content: '',
                top: 0,
                left: 0,
            },
        };

        this.setTooltipData = this.setTooltipData.bind(this);
    }

    setTooltipData(data?: IStaticTooltipData) {
        const tooltipData = data
            ? data
            : {
                  content: '',
                  top: 0,
                  left: 0,
              };

        this.setState({
            tooltipData,
        });
    }

    getListViewCards() {
        const {
            waybackItems,
            activeWaybackItem,
            rNum4SelectedWaybackItems,
            rNum4WaybackItemsWithLocalChanges,
            shouldOnlyShowItemsWithLocalChange,
            shouldDownloadButtonBeDisabled,
            downloadButtonTooltipText,
            toggleSelect,
            onClick,
            onMouseEnter,
            onMouseOut,
            downloadButtonOnClick,
        } = this.props;

        const cardData = shouldOnlyShowItemsWithLocalChange
            ? waybackItems.filter((d) => {
                  return (
                      rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) >
                      -1
                  );
              })
            : waybackItems;

        const cards = cardData.map((d) => {
            const isActive =
                activeWaybackItem.releaseNum === d.releaseNum ? true : false;
            const isSelected =
                rNum4SelectedWaybackItems.indexOf(d.releaseNum) > -1
                    ? true
                    : false;
            const isHighlighted =
                rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1
                    ? true
                    : false;

            return (
                <Card
                    key={`list-view-card-${d.releaseNum}`}
                    data={d}
                    isActive={isActive}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                    toggleSelect={toggleSelect}
                    shouldDownloadButtonBeDisabled={
                        shouldDownloadButtonBeDisabled
                    }
                    downloadButtonTooltipText={downloadButtonTooltipText}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseOut={onMouseOut}
                    toggleTooltip={this.setTooltipData}
                    downloadButtonOnClick={downloadButtonOnClick}
                />
            );
        });

        return cards;
    }

    render() {
        const cards = this.getListViewCards();

        // need to use a static tooltip that has the position relative to the window because the list view wrap has the "overflow-y: auto"
        // css property, which make the default tooltip hide by the container.
        const { tooltipData } = this.state;
        const { isMobile } = this.props;

        const staticTooltip = !isMobile ? (
            <StaticTooltip
                top={tooltipData.top}
                left={tooltipData.left}
                content={tooltipData.content}
            />
        ) : null;

        return (
            <>
                <div className="list-view-container">{cards}</div>
                {staticTooltip}
            </>
        );
    }
}

export default ListView;
