import React, { useMemo } from 'react';
import { AccountAvatar } from './AccountAvatar';
import { getSignedInUser, signIn, signOut } from '@utils/Esri-OAuth';
import { ProfileCard } from './ProfileCard';
import { useAppDispatch } from '@store/configureStore';
import { userProfileCardOpenToggled } from '@store/UI/reducer';
import { useUserData } from './useUserData';

export const AccountAvatarContainer = () => {
    const dispatch = useAppDispatch();

    // const signedInUser = getSignedInUser();

    // const userData: UserData = useMemo(() => {
    //     if (!signedInUser) {
    //         return {
    //             thumbnailUrl: '',
    //             userFullName: '',
    //             userName: '',
    //             orgName: '',
    //         };
    //     }

    //     return {
    //         thumbnailUrl: signedInUser.thumbnailUrl || '',
    //         userFullName: signedInUser.fullName || '',
    //         userName: signedInUser.username || '',
    //         orgName: signedInUser.portal?.name || '',
    //     };
    // }, [signedInUser]);

    // const [showProfileCard, setShowProfileCard] = React.useState(false);

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
            {/* {showProfileCard && userData && (
                <ProfileCard
                    userData={userData}
                    signOutOnClick={() => {
                        signOut();
                    }}
                    toggleOpenProfileCard={toggleOpenProfileCard}
                />
            )} */}
        </div>
    );
};
