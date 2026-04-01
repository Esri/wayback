import { WayportJob } from '@store/WayportMode/reducer';

/**
 * Determines whether the remove button for a Wayport job card should be disabled.
 *
 * The button is disabled when the job is actively being processed — either because
 * it is pending or waiting to start, or because the tile layer publish/update workflow
 * is in progress — to prevent users from removing a job mid-operation.
 *
 * @param job - The Wayport job to evaluate.
 * @returns `true` if the remove button should be disabled, `false` otherwise.
 */
export const checkShouldDisableRemoveButton = (job: WayportJob): boolean => {
    const { status, publishWayportTileLayerStatus } = job;

    // remove button should be disabled when the job is in progress (pending or waiting to start) or when the tile layer is being published or updated,
    // to prevent users from removing a job that is in the middle of being processed
    const shouldBeDisabled =
        status === 'wayport job pending' ||
        status === 'wayport job waiting to start' ||
        publishWayportTileLayerStatus ===
            'publishing job adding tile package' ||
        publishWayportTileLayerStatus === 'publishing job adding tile layer' ||
        publishWayportTileLayerStatus === 'publishing job updating tiles';

    return shouldBeDisabled;
};
