import { getProfileSettingsURL, getSignedInUser } from '@utils/Esri-OAuth';
import { useMemo } from 'react';

export type UserData = {
    thumbnailUrl: string;
    userFullName: string;
    userName: string;
    orgName: string;
    profileSettingsPageURL: string;
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
                profileSettingsPageURL: '',
            };
        }
        return {
            thumbnailUrl: signedInUser.thumbnailUrl || '',
            userFullName: signedInUser.fullName || '',
            userName: signedInUser.username || '',
            orgName: signedInUser.portal?.name || '',
            profileSettingsPageURL: getProfileSettingsURL(),
        };
    }, [signedInUser]);

    return userData;
};
