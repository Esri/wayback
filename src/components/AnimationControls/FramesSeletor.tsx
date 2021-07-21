import React from 'react';

import { IWaybackItem } from '../../types';

type Props = {
    waybackItems: IWaybackItem[];
    rNum4AnimationFrames: number[];
    activeItem: IWaybackItem;
    // onSelect: (data: IWaybackItem) => void;
};


const FramesSeletor:React.FC<Props> = ({
    waybackItems,
    rNum4AnimationFrames,
    activeItem
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

                // const classNames = classnames(
                //     'swipe-widget-layer-selector-item',
                //     {
                //         'is-selected': isSelected,
                //         'is-arrow-on-left': targetLayerType === 'trailing',
                //     }
                // );

                return (
                    <div
                        // className={classNames}
                        key={itemID}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            height: '38px',
                            margin: '.5rem 0',
                            padding: '0 .5rem',
                            backgroundColor: isSelected ? '#2267AE' : '#1C1C1C',
                            color: isSelected ? '#fff' : 'unset',
                            // borderLeft:
                            //     targetLayerType === 'leading' && isSelected
                            //         ? ' 4px solid #fff'
                            //         : '4px solid transparent',
                            // borderRight:
                            //     targetLayerType === 'trailing' && isSelected
                            //         ? ' 4px solid #fff'
                            //         : '4px solid transparent',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                        }}
                        // onClick={onSelect.bind(this, d)}
                    >
                        {releaseDateLabel}
                    </div>
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
