import React, { useMemo } from 'react';
import { AccountAvatar } from './AccountAvatar';
import { getSignedInUser, signIn, signOut } from '@utils/Esri-OAuth';
import { ProfileCard } from './ProfileCard';
import { useAppDispatch } from '@store/configureStore';
import { userProfileCardOpenToggled } from '@store/UI/reducer';
import { useUserData } from './useUserData';

export const AccountAvatarContainer = () => {
    const dispatch = useAppDispatch();

    const userData = useUserData();

    const toggleOpenProfileCard = () => {
        // setShowProfileCard(!showProfileCard);
        dispatch(userProfileCardOpenToggled());
    };

    return (
        <div className="relative">
            <AccountAvatar
                userData={userData}
                signInOnClick={() => {
                    signIn();
                }}
                signOutOnClick={() => {
                    signOut();
                }}
                toggleOpenProfileCard={toggleOpenProfileCard}
            />
        </div>
    );
};
