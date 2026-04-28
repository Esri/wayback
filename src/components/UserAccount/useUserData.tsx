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
