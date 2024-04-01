import React, { FC, useEffect } from 'react';
import useCurrenPageBecomesVisible from './useCurrenPageBecomesVisible';
import { revalidateToken } from '@utils/Esri-OAuth';

/**
 * Re-validate ArcGIS Online user token when current tab becomes active/visible again
 */
export const useRevalidateToken = () => {
    const currentPageIsVisibleAgain = useCurrenPageBecomesVisible();

    useEffect(() => {
        if (!currentPageIsVisibleAgain) {
            return;
        }

        revalidateToken();
    }, [currentPageIsVisibleAgain]);

    useEffect(() => {
        // revalidate token when body regain the focus
        document.body.onfocus = () => {
            revalidateToken();
        };
    }, []);
};
