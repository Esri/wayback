import React, { useMemo } from 'react';
import { AccountAvatar } from './AccountAvatar';
import { getSignedInUser, signIn, signOut } from '@utils/Esri-OAuth';
import { ProfileCard } from './ProfileCard';

export type UserData = {
    thumbnailUrl: string;
    userFullName: string;
    userName: string;
    orgName: string;
};

export const UserAccount = () => {
    const signedInUser = getSignedInUser();

    const userData: UserData = useMemo(() => {
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

    const [showProfileCard, setShowProfileCard] = React.useState(false);

    const toggleOpenProfileCard = () => {
        setShowProfileCard(!showProfileCard);
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
            {showProfileCard && userData && (
                <ProfileCard
                    userData={userData}
                    signOutOnClick={() => {
                        signOut();
                    }}
                    toggleOpenProfileCard={toggleOpenProfileCard}
                />
            )}
        </div>
    );
};
