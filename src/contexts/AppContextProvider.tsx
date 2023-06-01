import React, { useState, createContext } from 'react';
import WaybackManager from '../core/WaybackManager';
// import OAuthUtils from '../utils/Esri-OAuth';
import { getServiceUrl } from '../utils/Tier';
import { getCustomPortalUrl } from '../utils/LocalStorage';
import { miscFns } from 'helper-toolkit-ts';

import config from '../app-config';
import { initEsriOAuth } from '../utils/Esri-OAuth';

type AppContextValue = {
    waybackManager: WaybackManager;
    isMobile: boolean;
    onPremises: boolean;
};

type AppContextProviderProps = {
    waybackManager: WaybackManager;
    children?: React.ReactNode;
};

export const AppContext = createContext<AppContextValue>(null);

const AppContextProvider: React.FC<AppContextProviderProps> = ({
    waybackManager,
    children,
}: AppContextProviderProps) => {
    const [value, setValue] = useState<AppContextValue>();

    const init = async () => {
        const contextValue: AppContextValue = {
            // oauthUtils,
            // userSession,
            waybackManager,
            isMobile: miscFns.isMobileDevice(),
            onPremises: config.onPremises,
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
