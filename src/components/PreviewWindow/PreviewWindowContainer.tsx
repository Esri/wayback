import React, {
    useContext,
    useEffect
} from 'react';

import {
    useSelector,
    // useDispatch,
    // batch
} from 'react-redux';

import {
    previewWaybackItemSelector,
    releaseNum4AlternativePreviewWaybackItemSelector
} from '../../store/reducers/WaybackItems';

import TilePreviewWindow from './index';

import MapView from '@arcgis/core/views/MapView';
import { AppContext } from '../../contexts/AppContextProvider';

type Props = {
    mapView?: MapView;
}

const PreviewWindowContainer:React.FC<Props> = ({
    mapView
}) => {

    const { isMobile } = useContext(AppContext)

    const previewWaybackItem = useSelector(previewWaybackItemSelector);

    const releaseNum4AlternativePreviewWaybackItem = useSelector(releaseNum4AlternativePreviewWaybackItemSelector);

    useEffect(()=>{
        console.log('previewWaybackItem', previewWaybackItem)
        console.log('releaseNum4AlternativePreviewWaybackItem', releaseNum4AlternativePreviewWaybackItem)
    }, [previewWaybackItem, releaseNum4AlternativePreviewWaybackItem])

    return !isMobile ? (
        <TilePreviewWindow
            // no need to show preview window in mobile view, therefore just pass the null as previewWaybackItem
            previewWaybackItem={previewWaybackItem}
            alternativeRNum4RreviewWaybackItem={
                releaseNum4AlternativePreviewWaybackItem
            }
            mapView={mapView}
        />
    ) : <></>
}

export default PreviewWindowContainer
