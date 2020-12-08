import React, {
    useContext,
    useEffect
} from 'react';

import {
    useSelector,
    useDispatch
} from 'react-redux'

import {
    isSaveAsWebmapDialogOpenSelector,
    isSaveAsWebmapDialogOpenToggled
} from '../../store/reducers/UI';

import {
    mapExtentSelector
} from '../../store/reducers/Map';

import {
    allWaybackItemsSelector,
    releaseNum4SelectedItemsSelector
} from '../../store/reducers/WaybackItems';

import {
    AppContext
} from '../../contexts/AppContextProvider';

import SaveAsWebMapDialog from './index';
import { IExtentGeomety, IWaybackItem } from '../../types';

const SaveAsWebmapDialogContainer = () => {

    const dispatch = useDispatch();

    const {
        userSession
    } = useContext(AppContext);

    const mapExtent: IExtentGeomety = useSelector(mapExtentSelector);

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);

    const rNum4SelectedWaybackItems: number[] = useSelector(releaseNum4SelectedItemsSelector);

    const isOpen: boolean = useSelector(isSaveAsWebmapDialogOpenSelector);

    const onCloseHandler = ()=>{
        dispatch(isSaveAsWebmapDialogOpenToggled());
    };

    useEffect(()=>{
        console.log(isOpen)
    }, [isOpen])

    return isOpen ? (
        <SaveAsWebMapDialog
            waybackItems={waybackItems}
            rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}
            userSession={userSession}
            mapExtent={mapExtent}
            onClose={onCloseHandler}
        />
    ) : null;
}

export default SaveAsWebmapDialogContainer
