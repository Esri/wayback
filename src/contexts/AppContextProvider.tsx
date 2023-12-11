import React, { useState, createContext } from 'react';
import { miscFns } from 'helper-toolkit-ts';
import config from '../app-config';

type AppContextValue = {
    isMobile: boolean;
    onPremises: boolean;
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
