import { useAppDispatch } from '@store/configureStore';
import { restoreNewWayportJobFromSessionStorage } from '@store/WayportMode/thunks';
import { getSignedInUser } from '@utils/Esri-OAuth';
import React, { useEffect } from 'react';

export const useRestoreNewWayportJob = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(restoreNewWayportJobFromSessionStorage());
    }, []);
};
