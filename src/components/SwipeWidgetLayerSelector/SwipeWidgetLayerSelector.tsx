import * as React from 'react'
import { IWaybackItem } from '../../types';

export const SwipeWidgetLayerSelectorWidth = 200;

type SwipeWidgetLayer = 'leading' | 'trailing'

type Props = {
    targetLayerType: SwipeWidgetLayer;
    waybackItems: IWaybackItem[];
    rNum4WaybackItemsWithLocalChanges: number[];
    onSelect:(data:IWaybackItem)=>void;
}

const SwipeWidgetLayerSelector:React.FC<Props> = ({
    targetLayerType,
    waybackItems,
    rNum4WaybackItemsWithLocalChanges,
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
                return (
                    <div 
                        key={itemID}
                        onClick={onSelect.bind(this, d)}
                    >{releaseDateLabel}</div>
                )
            })

        return (
            <div>
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
                padding: '1rem .5rem',
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
