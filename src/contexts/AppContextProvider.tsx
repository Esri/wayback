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
// import config from '../app-config';

type AppContextValue = {
    isMobile: boolean;
};

type AppContextProviderProps = {
    children?: React.ReactNode;
};

export const AppContext = createContext<AppContextValue>(null);

const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
}: AppContextProviderProps) => {
    const [value, setValue] = useState<AppContextValue>();

    const init = async () => {
        const contextValue: AppContextValue = {
            isMobile: miscFns.isMobileDevice(),
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
