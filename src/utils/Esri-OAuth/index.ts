// import { loadModules } from 'esri-loader';

// import { IUserSession } from '../../types';

// import IOAuthInfo from 'esri/identity/OAuthInfo';
// import IIdentityManager from 'esri/identity/IdentityManager';
// import IPortal from 'esri/portal/Portal';
// import ICredential from 'esri/identity/Credential';
// import IEsriConfig from 'esri/config';

import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import Portal from '@arcgis/core/portal/Portal';
import Credential from '@arcgis/core/identity/Credential';
import esriConfig from '@arcgis/core/config';

type Props = {
    appId: string;
    portalUrl?: string;
};

type OAuthResponse = {
    credential: Credential;
    portal: Portal;
};

let oauthInfo: OAuthInfo;
let esriId: typeof IdentityManager = null;
/**
 * Instance of ArcGIS Online portal for signed-in user
 */
let userPortal: Portal;
let credential: Credential = null;

/**
 *
 * @param param0
 * @returns
 */
export const initEsriOAuth = async ({
    appId,
    portalUrl = 'https://www.arcgis.com',
}: Props): Promise<OAuthResponse> => {
    try {
        // const platformSelfResponse = await platformSelf(appId, portalUrl);

        oauthInfo = new OAuthInfo({
            appId,
            portalUrl,
            popup: false,
            // preserveUrlHash: true,
        });

        esriId = IdentityManager;

        esriId.registerOAuthInfos([oauthInfo]);

        credential = await esriId.checkSignInStatus(
            oauthInfo.portalUrl + '/sharing'
        );

        // init Portal instance
        userPortal = new Portal({ url: portalUrl });

        // Setting authMode to immediate signs the user in once loaded
        userPortal.authMode = 'immediate';

        // Once loaded, user is signed in
        await userPortal.load();
    } catch (err) {
        console.log('anomynous user');
    }

    return {
        credential,
        portal: userPortal,
    };
};

export const signIn = async (): Promise<void> => {
    const credential: Credential = await esriId.getCredential(
        oauthInfo.portalUrl + '/sharing'
    );
    console.log('signed in as', credential.userId);
};

export const signOut = async (): Promise<void> => {
    esriId.destroyCredentials();
    window.location.reload();
};

export const signInUsingDifferentAccount = () => {
    esriId.destroyCredentials();
    signIn();
};

export const getPortalBaseUrl = () => {
    if (!userPortal) {
        return null;
    }

    const { urlKey, url, customBaseUrl } = userPortal;

    return urlKey ? `https://${urlKey}.${customBaseUrl}` : `${url}`;
};

/**
 * call this function to direct to the switch account page on ArcGIS Online
 */
export const switchAccount = () => {
    const portalBaseUrl = getPortalBaseUrl();
    const redirectUri = `${window.location.origin}${window.location.pathname}index.html`;
    const targetUrl = `${portalBaseUrl}/home/pages/Account/manage_accounts.html#redirect_uri=${redirectUri}&client_id=arcgisonline`;
    window.open(targetUrl, '_blank');
};

/**
 * Check and see if user is signed or not
 * @returns boolean return false if not signed in yet
 */
export const isAnonymouns = () => {
    return credential === null;
};

/**
 * Get the Token from the credential of signed in user
 * @returns
 */
export const getToken = () => {
    if (!credential) {
        return '';
    }

    return credential.token;
};

/**
 * Get Portal User instance for signed-in user
 * @returns IPortalUser
 */
export const getSignedInUser = () => {
    return userPortal?.user || null;
};

// /**
//  * get the id of "My Favorites" group of the signed in user
//  */
// export const getMyFavoritesGroupId = () => {
//     if (!userPortal) {
//         return '';
//     }

//     const user: IPortalUser & {
//         favGroupId?: string;
//     } = userPortal.user;

//     return user?.favGroupId;
// };

/**
 * Get Portal Instance for signed in user
 * @returns
 */
export const getUserPortal = (): Portal => {
    return userPortal;
};

/**
 * Get role of signed in user
 * @returns
 */
export const getUserRole = (): string => {
    return userPortal?.user?.role;
};

/**
 * Get credential of signed in user
 * @returns
 */
export const getCredential = (): Credential => {
    return credential;
};
