import { getSignedInUser } from '@utils/Esri-OAuth';
import { useMemo } from 'react';

export type UserData = {
    thumbnailUrl: string;
    userFullName: string;
    userName: string;
    orgName: string;
};

export const useUserData = (): UserData => {
    const signedInUser = getSignedInUser();

    const userData = useMemo(() => {
        if (!signedInUser) {
            return {
                thumbnailUrl: '',
                userFullName: '',
                userName: '',
                orgName: '',
            };
        }
        return {
            thumbnailUrl: signedInUser.thumbnailUrl || '',
            userFullName: signedInUser.fullName || '',
            userName: signedInUser.username || '',
            orgName: signedInUser.portal?.name || '',
        };
    }, [signedInUser]);

    return userData;
};
