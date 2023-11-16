import React, { useMemo } from 'react';
import { usePrevious } from './usePrevious';
import useVisibilityState from './useVisibilityState';

/**
 * Return true when current page becomes visible again
 */
const useCurrenPageBecomesVisible = () => {
    /**
     * If true, the tab of current page is visible
     */
    const isPageVisible = useVisibilityState();

    /**
     * previous value of the visibility state
     */
    const isPageVisiblePrevState = usePrevious(isPageVisible);

    const currentPageIsVisibleAgain = useMemo(() => {
        return isPageVisiblePrevState === false && isPageVisible === true;
    }, [isPageVisible, isPageVisiblePrevState]);

    return currentPageIsVisibleAgain;
};

export default useCurrenPageBecomesVisible;
