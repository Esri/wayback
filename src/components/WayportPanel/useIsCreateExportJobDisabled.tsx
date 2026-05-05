import { AppContext } from '@contexts/AppContextProvider';
import React, { useContext } from 'react';

/**
 * This custom hook determines whether the "Create New Export Job" button should be disabled based on the user's sign-in status and privileges.
 * @returns
 */
export const useIsCreateExportJobDisabled = () => {
    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    const isDisabled = notSignedIn || signedInWithArcGISPublicAccount;

    return isDisabled;
};
