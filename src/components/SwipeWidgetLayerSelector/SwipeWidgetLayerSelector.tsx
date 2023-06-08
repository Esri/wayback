import './SwipeWidgetLayerSelector.css';
import React from 'react';
import { IWaybackItem } from '@typings/index';
import classnames from 'classnames';

import { LayerSelector } from '../';

export const SwipeWidgetLayerSelectorWidth = 210;

export type SwipeWidgetLayer = 'leading' | 'trailing';

type Props = {
    targetLayerType: SwipeWidgetLayer;
    waybackItems: IWaybackItem[];
    rNum4WaybackItemsWithLocalChanges: number[];
    selectedItem: IWaybackItem;
    // showCloseBtn?: boolean;
    onSelect: (data: IWaybackItem) => void;
    onClose?: () => void;
};

const SwipeWidgetLayerSelector: React.FC<Props> = ({
    targetLayerType,
    waybackItems,
    rNum4WaybackItemsWithLocalChanges,
    selectedItem,
    // showCloseBtn,
    onSelect,
    onClose,
}: Props) => {
    const getList = () => {
        const items = waybackItems
            .filter((d) => {
                return (
                    rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1
                );
            })
            .map((d) => {
                const { releaseDateLabel, itemID } = d;
                const isSelected =
                    selectedItem && selectedItem.itemID === itemID;
                const classNames = classnames(
                    'swipe-widget-layer-selector-item',
                    {
                        'is-selected': isSelected,
                        'is-arrow-on-left': targetLayerType === 'trailing',
                    }
                );
                // return (
                //     <div
                //         className={classNames}
                //         key={itemID}
                //         style={{
                //             position: 'relative',
                //             display: 'flex',
                //             alignItems: 'center',
                //             width: '100%',
                //             height: '38px',
                //             margin: '.5rem 0',
                //             padding: '0 .5rem',
                //             backgroundColor: isSelected ? '#2267AE' : '#1C1C1C',
                //             color: isSelected ? '#fff' : 'unset',
                //             borderLeft:
                //                 targetLayerType === 'leading' && isSelected
                //                     ? ' 4px solid #fff'
                //                     : '4px solid transparent',
                //             borderRight:
                //                 targetLayerType === 'trailing' && isSelected
                //                     ? ' 4px solid #fff'
                //                     : '4px solid transparent',
                //             boxSizing: 'border-box',
                //             cursor: 'pointer',
                //         }}
                //         onClick={onSelect.bind(this, d)}
                //     >
                //         {releaseDateLabel}
                //     </div>
                // );

                return (
                    <LayerSelector
                        key={itemID}
                        isSelected={isSelected}
                        showArrowOnLeft={targetLayerType === 'trailing'}
                        onClick={onSelect.bind(this, d)}
                    >
                        {releaseDateLabel}
                    </LayerSelector>
                );
            });

        return (
            <div
                style={{
                    width: '100%',
                }}
            >
                <div>
                    <span className="font-size--2">
                        Versions with{' '}
                        <span className="text-white">local changes</span>
                    </span>
                </div>
                {items}
            </div>
        );
    };

    const getTitle = () => {
        if (!selectedItem) {
            return null;
        }

        return (
            <div
                className="text-center text-blue"
                style={{
                    position: 'absolute',
                    top: '1rem',
                }}
            >
                <h4 className="font-size-2 avenir-light trailer-0">
                    {targetLayerType === 'leading' ? 'Left' : 'Right'} Selection
                </h4>
                <div>
                    <span>{selectedItem.releaseDateLabel}</span>
                    <br />
                    <span className="font-size--3">
                        Click map for imagery details
                    </span>
                </div>
            </div>
        );
    };

    const getCloseBtn = () => {
        if (!onClose) {
            return null;
        }

        return (
            <div
                style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0',
                    cursor: 'pointer',
                }}
                onClick={onClose}
            >
                <span className="icon-ui-close text-white"></span>
            </div>
        );
    };

    return (
        <div
            style={{
                // position: 'absolute',
                height: '100%',
                width: SwipeWidgetLayerSelectorWidth,
                top: 0,
                left: targetLayerType === 'leading' ? 0 : 'unset',
                right: targetLayerType === 'trailing' ? 0 : 'unset',
                backgroundColor: '#121212',
                padding: '1rem',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {getTitle()}
            {getCloseBtn()}
            {getList()}
        </div>
    );
};

export default SwipeWidgetLayerSelector;
