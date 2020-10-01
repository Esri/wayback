import './style.scss';
import * as React from 'react'
import { IWaybackItem } from '../../types';
import classnames from 'classnames';

export const SwipeWidgetLayerSelectorWidth = 200;

type SwipeWidgetLayer = 'leading' | 'trailing'

type Props = {
    targetLayerType: SwipeWidgetLayer;
    waybackItems: IWaybackItem[];
    rNum4WaybackItemsWithLocalChanges: number[];
    selectedItem: IWaybackItem;
    onSelect:(data:IWaybackItem)=>void;
}

const SwipeWidgetLayerSelector:React.FC<Props> = ({
    targetLayerType,
    waybackItems,
    rNum4WaybackItemsWithLocalChanges,
    selectedItem,
    onSelect
}) => {

    const getList = ()=>{
        const items = waybackItems
            .filter((d) => {
                return (
                    rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) >
                    -1
                );
            })
            .map(d=>{
                const { releaseDateLabel, itemID } = d;
                const isSelected = selectedItem && selectedItem.itemID === itemID;
                const classNames = classnames('swipe-widget-layer-selector-item', {
                    'is-selected': isSelected,
                    'is-arrow-on-left': targetLayerType === 'trailing'
                })
                return (
                    <div 
                        className={classNames}
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
                            boxSizing: 'border-box',
                            cursor: 'pointer'
                        }}
                        onClick={onSelect.bind(this, d)}
                    >{releaseDateLabel}</div>
                )
            })

        return (
            <div
                style={{
                    width: '100%'
                }}
            >
                { items }
            </div>
        )
    }

    return (
        <div
            style={{
                position: 'absolute',
                height: '100%',
                width: SwipeWidgetLayerSelectorWidth,
                top: 0,
                left: targetLayerType === 'leading' ? 0 : 'unset',
                right: targetLayerType === 'trailing' ? 0 : 'unset',
                backgroundColor: '#121212',
                padding: '1rem',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {getList()}
        </div>
    )
}

export default SwipeWidgetLayerSelector
