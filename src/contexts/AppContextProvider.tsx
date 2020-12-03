import React, { useState, createContext } from 'react';
import WaybackManager from '../core/WaybackManager';
import { IUserSession } from '../types';
import OAuthUtils from '../utils/Esri-OAuth';
import { getServiceUrl } from '../utils/Tier';
import {
    getCustomPortalUrl,
} from '../utils/LocalStorage';
import config from '../app-config';

type AppContextValue = {
    waybackManager: WaybackManager;
    oauthUtils: OAuthUtils;
    userSession: IUserSession
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

    const [ value, setValue ] = useState<AppContextValue>();

    const init = async () => {

        const oauthUtils = new OAuthUtils();

        const userSession = await getUserSession(oauthUtils);
        // console.log('userSession', userSession);

        const contextValue: AppContextValue = {
            oauthUtils,
            userSession,
            waybackManager
        };

        setValue(contextValue);
    };

    const getUserSession = async(oauthUtils:OAuthUtils):Promise<IUserSession>=>{

        try {
            const userSession = await oauthUtils.init({
                appId: config.appId,
                portalUrl: getCustomPortalUrl() || getServiceUrl('portal-url'),
            });
    
            return userSession;

        } catch(err){
            console.error(err);
            return null;
        }
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