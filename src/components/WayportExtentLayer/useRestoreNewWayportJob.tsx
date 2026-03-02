import { useAppDispatch } from '@store/configureStore';
import { restoreNewDownloadJobFromSessionStorage } from '@store/DownloadMode/thunks';
import { getSignedInUser } from '@utils/Esri-OAuth';
import React, { useEffect } from 'react';

export const useRestoreNewWayportJob = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(restoreNewDownloadJobFromSessionStorage());
    }, []);
};
