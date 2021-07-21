import React from 'react';

import { IWaybackItem } from '../../types';

import {
    LayerSelector
} from '../'

type Props = {
    waybackItems: IWaybackItem[];
    rNum4AnimationFrames: number[];
    activeItem: IWaybackItem;
    onSelect: (data: IWaybackItem) => void;
};


const FramesSeletor:React.FC<Props> = ({
    waybackItems,
    rNum4AnimationFrames,
    activeItem,
    onSelect
}:Props) => {

    const getList = () => {
        const items = waybackItems
            .filter((d) => {
                return (
                    rNum4AnimationFrames.indexOf(d.releaseNum) > -1
                );
            })
            .map((d) => {
                const { releaseDateLabel, itemID } = d;
                const isSelected =
                    activeItem && activeItem.itemID === itemID;

                return (
                    <LayerSelector
                        // className={classNames}
                        key={itemID}
                        isSelected={isSelected}
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
                        Animation Frames
                    </span>
                </div>
                {items}
            </div>
        );
    };

    return getList()
}

export default FramesSeletor
