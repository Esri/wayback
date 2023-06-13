import React, { useContext } from 'react';

import {
    useSelector,
    useDispatch,
    // batch
} from 'react-redux';

import {
    releaseNum4SelectedItemsSelector,
    releaseNum4ItemsWithLocalChangesSelector,
    activeWaybackItemSelector,
    allWaybackItemsSelector,
    setPreviewWaybackItem,
    setActiveWaybackItem,
    toggleSelectWaybackItem,
    selectWaybackItemsByReleaseNum,
} from '@store/Wayback/reducer';

import { shouldOnlyShowItemsWithLocalChangeSelector } from '@store/UI/reducer';

import ListView from './index';
import { AppContext } from '@contexts/AppContextProvider';
import { addToDownloadList } from '@store/DownloadMode/thunks';
import { IWaybackItem } from '@typings/index';
import { mapExtentSelector, selectMapCenterAndZoom } from '@store/Map/reducer';
import { selectHasReachedLimitOfConcurrentDownloadJobs } from '@store/DownloadMode/selectors';

type Props = {
    children?: React.ReactNode;
};

const ListViewWrapper: React.FC<Props> = ({ children }) => {
    return (
        <div
            className="leader-half fancy-scrollbar"
            style={{
                position: 'relative',
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 200,
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            <div className="mx-4">{children}</div>
        </div>
    );
};

const ListViewContainer = () => {
    const dispatch = useDispatch();

    const { isMobile } = useContext(AppContext);

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);
    const activeWaybackItem: IWaybackItem = useSelector(
        activeWaybackItemSelector
    );

    const rNum4SelectedWaybackItems: number[] = useSelector(
        releaseNum4SelectedItemsSelector
    );
    const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(
        releaseNum4ItemsWithLocalChangesSelector
    );

    const shouldOnlyShowItemsWithLocalChange = useSelector(
        shouldOnlyShowItemsWithLocalChangeSelector
    );

    const hasReachedLimitOfConcurrentDownloadJobs = useSelector(
        selectHasReachedLimitOfConcurrentDownloadJobs
    );

    const { zoom } = useSelector(selectMapCenterAndZoom);

    const mapExtent = useSelector(mapExtentSelector);

    return (
        <ListViewWrapper>
            <ListView
                isMobile={isMobile}
                waybackItems={waybackItems}
                activeWaybackItem={activeWaybackItem}
                hasReachedLimitOfConcurrentDownloadJobs={
                    hasReachedLimitOfConcurrentDownloadJobs
                }
                shouldOnlyShowItemsWithLocalChange={
                    shouldOnlyShowItemsWithLocalChange
                }
                rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}
                rNum4WaybackItemsWithLocalChanges={
                    rNum4WaybackItemsWithLocalChanges
                }
                onClick={(releaseNum: number) => {
                    dispatch(setActiveWaybackItem(releaseNum));
                }}
                onMouseEnter={(releaseNum: number) => {
                    dispatch(setPreviewWaybackItem(releaseNum));
                }}
                onMouseOut={() => [dispatch(setPreviewWaybackItem())]}
                toggleSelect={(releaseNum: number) => {
                    dispatch(toggleSelectWaybackItem(releaseNum));
                }}
                downloadButtonOnClick={(releaseNum: number) => {
                    dispatch(
                        addToDownloadList({
                            releaseNum,
                            extent: mapExtent,
                            zoomLevel: zoom,
                        })
                    );
                }}
            />
        </ListViewWrapper>
    );
};

export default ListViewContainer;
