import React, { useEffect, useState } from 'react';

/**
 * Use Page Visibility API to check and see if the current page is visible.
 *
 * When the user minimizes the window or switches to another tab,
 * the API sends a visibilitychange event to let listeners know the state of the page has changed.
 * @returns `boolean` if true, the current page is visible
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
const useVisibilityState = () => {
    const [isPageVisible, setIsPageVisible] = useState(true);

    useEffect(() => {
        document.addEventListener('visibilitychange', (event) => {
            setIsPageVisible(document.visibilityState == 'visible');
        });
    }, []);

    return isPageVisible;
};

export default useVisibilityState;
