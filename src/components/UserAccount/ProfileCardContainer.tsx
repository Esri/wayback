import React from 'react';
import { ProfileCard } from './ProfileCard';
import { useUserData } from './useUserData';
import { signOut } from '@utils/Esri-OAuth';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    isUserProfileCardOpenSelector,
    userProfileCardOpenToggled,
} from '@store/UI/reducer';

export const ProfileCardContainer = () => {
    const dispatch = useAppDispatch();

    const userData = useUserData();

    const isProfileCardOpen = useAppSelector(isUserProfileCardOpenSelector);

    if (!isProfileCardOpen) {
        return null;
    }

    return (
        <div className="fixed left-gutter-width bottom-2 z-50 pl-2">
            <ProfileCard
                userData={userData}
                signOutOnClick={() => {
                    signOut();
                }}
                closeProfileCard={() => {
                    dispatch(userProfileCardOpenToggled(false));
                }}
            />
        </div>
    );
};
