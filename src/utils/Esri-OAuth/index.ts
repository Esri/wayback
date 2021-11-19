// import { loadModules } from 'esri-loader';

import { IUserSession } from '../../types';

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

export default class OAuthUtils {
    private oauthInfo: OAuthInfo;
    private esriId: typeof IdentityManager;

    // constructor() {}

    async init({
        appId = '',
        portalUrl = 'https://www.arcgis.com',
    } = {}): Promise<IUserSession> {
        if (portalUrl !== 'https://www.arcgis.com') {
            esriConfig.request.trustedServers.push(portalUrl);
        }

        this.oauthInfo = new OAuthInfo({
            appId,
            popup: false,
            portalUrl,
        });

        // IdentityManager.useSignInPage = false;

        IdentityManager.registerOAuthInfos([this.oauthInfo]);

        this.esriId = IdentityManager;

        const credential: Credential = await this.esriId.checkSignInStatus(
            this.oauthInfo.portalUrl + '/sharing'
        );

        // init paortal
        const portal = new Portal({ url: portalUrl });
        // Setting authMode to immediate signs the user in once loaded
        portal.authMode = 'immediate';

        // Once loaded, user is signed in
        await portal.load();

        return {
            credential,
            portal,
        };

        // try {
        //     type Modules = [
        //         typeof IOAuthInfo,
        //         typeof IIdentityManager,
        //         typeof IPortal,
        //         typeof IEsriConfig
        //     ];

        //     const [ OAuthInfo, IdentityManager, Portal, esriConfig ] = await (loadModules([
        //         'esri/identity/OAuthInfo',
        //         'esri/identity/IdentityManager',
        //         'esri/portal/Portal',
        //         'esri/config'
        //     ]) as Promise<Modules>);

        //     if(portalUrl !== 'https://www.arcgis.com'){
        //         esriConfig.request.trustedServers.push(portalUrl);
        //     }

        //     this.oauthInfo = new OAuthInfo({
        //         appId,
        //         popup: false,
        //         portalUrl,
        //     });

        //     IdentityManager.useSignInPage = false;

        //     IdentityManager.registerOAuthInfos([this.oauthInfo]);

        //     this.esriId = IdentityManager;

        //     const credential: Credential = await this.esriId.checkSignInStatus(
        //         this.oauthInfo.portalUrl + '/sharing'
        //     );

        //     // init paortal
        //     const portal = new Portal({ url: portalUrl });
        //     // Setting authMode to immediate signs the user in once loaded
        //     portal.authMode = 'immediate';

        //     // Once loaded, user is signed in
        //     await portal.load();

        //     return {
        //         credential,
        //         portal,
        //     };
        // } catch (err) {
        //     return null;
        // }
    }

    signIn() {
        this.esriId
            .getCredential(this.oauthInfo.portalUrl + '/sharing')
            .then((res: Credential) => {
                console.log('signed in as', res.userId);
            });
    }

    signOut() {
        this.esriId.destroyCredentials();
        window.location.reload();
    }
}
