import * as React from 'react'
import { IWaybackItem } from '../../types';

export const SwipeWidgetLayerSelectorWidth = 200;

type SwipeWidgetLayer = 'leading' | 'trailing'

type Props = {
    targetLayerType: SwipeWidgetLayer;
    waybackItems: IWaybackItem[];
    rNum4WaybackItemsWithLocalChanges: number[];
}

const SwipeWidgetLayerSelector:React.FC<Props> = ({
    targetLayerType,
    waybackItems,
    rNum4WaybackItemsWithLocalChanges
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                height: '100%',
                width: SwipeWidgetLayerSelectorWidth,
                top: 0,
                left: targetLayerType === 'leading' ? 0 : 'unset',
                right: targetLayerType === 'trailing' ? 0 : 'unset',
                backgroundColor: '#121212'
            }}
        >
            
        </div>
    )
}

export default SwipeWidgetLayerSelector
