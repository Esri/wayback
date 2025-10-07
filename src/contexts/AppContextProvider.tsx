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

import React, { useState, createContext } from 'react';
import { miscFns } from 'helper-toolkit-ts';
import {
    getProfileSettingsURL,
    isAnonymouns,
    isSignedInWithArcGISPublicAccount,
} from '@utils/Esri-OAuth';
// import config from '../app-config';

type AppContextValue = {
    /**
     * True if the app is being viewed on a mobile device (phone or tablet). False otherwise.
     */
    isMobile: boolean;
    /**
     * If true, user is not signed in.
     */
    notSignedIn: boolean;
    /**
     * If true, user is signed in with an ArcGIS public account.
     */
    signedInWithArcGISPublicAccount: boolean;
    /**
     * URL to the user profile settings page where user can update their account information.
     */
    userProfileSettingsPageURL: string;
};

type AppContextProviderProps = {
    children?: React.ReactNode;
};

export const AppContext = createContext<AppContextValue>(null);

const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
}: AppContextProviderProps) => {
    const [value, setValue] = useState<AppContextValue>(null);

    const init = async () => {
        const contextValue: AppContextValue = {
            isMobile: miscFns.isMobileDevice(),
            notSignedIn: isAnonymouns(),
            signedInWithArcGISPublicAccount:
                isSignedInWithArcGISPublicAccount(),
            userProfileSettingsPageURL: getProfileSettingsURL(),
        };

        setValue(contextValue);
    };

    React.useEffect(() => {
        init();
    }, []);

    return (
        <AppContext.Provider value={value}>
            {value ? children : null}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
