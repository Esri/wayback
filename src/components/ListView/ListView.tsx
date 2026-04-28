/* Copyright 2024-2026 Esri
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

import { IWaybackItem } from '@typings/index';

import { ListViewCard as Card } from './Card';

interface IProps {
    isMobile: boolean;
    waybackItems: Array<IWaybackItem>;
    activeWaybackItem: IWaybackItem;
    shouldOnlyShowItemsWithLocalChange: boolean;
    rNum4SelectedWaybackItems: Array<number>;
    rNum4WaybackItemsWithLocalChanges: Array<number>;
    /**
     * If true, the export button will be disabled. This happens when there is an ongoing export task for this release, and the user cannot start another export until the current one is finished.
     */
    shouldExportButtonBeDisabled: boolean;
    toggleSelect?: (releaseNum: number) => void;
    onClick?: (releaseNum: number) => void;
    downloadButtonOnClick: (releaseNum: number) => void;
    onMouseEnter?: (releaseNum: number) => void;
    onMouseOut?: () => void;
}

const ListView: React.FC<IProps> = ({
    waybackItems,
    activeWaybackItem,
    rNum4SelectedWaybackItems,
    rNum4WaybackItemsWithLocalChanges,
    shouldOnlyShowItemsWithLocalChange,
    shouldExportButtonBeDisabled,
    toggleSelect,
    onClick,
    onMouseEnter,
    onMouseOut,
    downloadButtonOnClick,
}) => {
    const cardData = React.useMemo(() => {
        if (!waybackItems || waybackItems.length === 0) {
            return [];
        }

        return shouldOnlyShowItemsWithLocalChange
            ? waybackItems.filter((d) => {
                  return (
                      rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) >
                      -1
                  );
              })
            : waybackItems;
    }, [
        shouldOnlyShowItemsWithLocalChange,
        waybackItems,
        rNum4WaybackItemsWithLocalChanges,
    ]);

    return (
        <div className="list-view-container" data-testid="card-list">
            {cardData.map((d) => {
                const isActive =
                    activeWaybackItem.releaseNum === d.releaseNum
                        ? true
                        : false;
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
                        shouldExportButtonBeDisabled={
                            shouldExportButtonBeDisabled
                        }
                        toggleSelect={toggleSelect}
                        onClick={onClick}
                        onMouseEnter={onMouseEnter}
                        onMouseOut={onMouseOut}
                        downloadButtonOnClick={downloadButtonOnClick}
                    />
                );
            })}
        </div>
    );
};

export default ListView;
