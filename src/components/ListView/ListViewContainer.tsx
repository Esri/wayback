import React, { useContext, useMemo } from 'react';

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

    const downloadButtonTooltipText = useMemo(() => {
        const text =
            'Download an imagery tile package for the current map extent';

        if (zoom < 12) {
            return text + ` (zoom in to enable)`;
        }

        if (hasReachedLimitOfConcurrentDownloadJobs) {
            return 'Reached the maximum limit of 5 concurrent download jobs';
        }

        return text;
    }, [zoom, hasReachedLimitOfConcurrentDownloadJobs]);

    return (
        <ListViewWrapper>
            <ListView
                isMobile={isMobile}
                waybackItems={waybackItems}
                activeWaybackItem={activeWaybackItem}
                shouldDownloadButtonBeDisabled={
                    hasReachedLimitOfConcurrentDownloadJobs || zoom < 12
                }
                downloadButtonTooltipText={downloadButtonTooltipText}
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
