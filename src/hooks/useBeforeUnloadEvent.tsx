import { useAppSelector } from '@store/configureStore';
import { selectIsThereAnyOngoingJobs } from '@store/WayportMode/selectors';
import React, { use, useEffect } from 'react';

export const useBeforeUnloadEvent = () => {
    const hasOngoingJobs = useAppSelector(selectIsThereAnyOngoingJobs);

    const shouldPromptUser = hasOngoingJobs;

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (shouldPromptUser) {
                event.preventDefault();
                // event.returnValue = 'You have ongoing jobs. Are you sure you want to leave?'
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [shouldPromptUser]);
};
