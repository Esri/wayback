/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
