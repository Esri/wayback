import React, {
    useContext
} from 'react'

import {
    useSelector,
    useDispatch,
    batch,
    // batch
} from 'react-redux';
import { AppContext } from '../../contexts/AppContextProvider';

import {
    releaseNum4ItemsWithLocalChangesSelector,
    allWaybackItemsSelector,
    releaseNum4ActiveWaybackItemUpdated
} from '../../store/reducers/WaybackItems';

import {
    metadataQueryResultUpdated
} from '../../store/reducers/Map';

import {
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
    releaseNum4LeadingLayerUpdated,
    releaseNum4TrailingLayerUpdated,
    isSwipeWidgetOpenSelector,
    isSwipeWidgetOpenToggled
} from '../../store/reducers/SwipeView'

import { IWaybackItem } from '../../types';

import SwipeWidgetLayerSelector, {
    SwipeWidgetLayer
} from './SwipeWidgetLayerSelector'

type Props = {
    targetLayer: SwipeWidgetLayer
}

const SwipeWidgetLayerSelectorContainer:React.FC<Props> = ({
    targetLayer
}:Props) => {

    const dispatch = useDispatch();

    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);
    const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(releaseNum4ItemsWithLocalChangesSelector);

    const leadingLayer: IWaybackItem = useSelector(swipeWidgetLeadingLayerSelector);
    const trailingLayer: IWaybackItem = useSelector(swipeWidgetTrailingLayerSelector);

    const closeBtnOnClick = targetLayer === 'trailing' 
        ? ()=>{
            dispatch(isSwipeWidgetOpenToggled())
        } 
        : null;

    return isSwipeWidgetOpen && !isMobile ? (
        <SwipeWidgetLayerSelector 
            targetLayerType={targetLayer}
            waybackItems={waybackItems}
            rNum4WaybackItemsWithLocalChanges={
                rNum4WaybackItemsWithLocalChanges
            }
            selectedItem={targetLayer === 'leading' ? leadingLayer : trailingLayer }
            onSelect={(waybackItem)=>{

                const { releaseNum } = waybackItem

                dispatch(metadataQueryResultUpdated(null));

                if(targetLayer === 'leading'){
                    dispatch(releaseNum4LeadingLayerUpdated(releaseNum))
                    dispatch(releaseNum4ActiveWaybackItemUpdated(releaseNum))
                } else {
                    dispatch(releaseNum4TrailingLayerUpdated(releaseNum))
                }

            }}
            onClose={closeBtnOnClick}
        />
    ) : null;
}

export default SwipeWidgetLayerSelectorContainer
