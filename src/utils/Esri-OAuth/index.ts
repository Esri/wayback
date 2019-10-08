import { loadModules } from 'esri-loader';

import { IUserSession } from '../../types';
import IOAuthInfo from "esri/identity/OAuthInfo";
import IIdentityManager from  "esri/identity/IdentityManager";
import IPortal from "esri/portal/Portal";
import ICredential from "esri/identity/Credential";

export default class OAuthUtils {

    private oauthInfo:IOAuthInfo;
    private esriId:any;

    constructor(){

    }

    async init({
        appId='',
        portalUrl = 'https://www.arcgis.com'
    }={}):Promise<IUserSession>{

        try {
            type Modules = [
                typeof IOAuthInfo,
                typeof IIdentityManager,
                typeof IPortal
            ];
    
            const [ OAuthInfo, IdentityManager, Portal ] = await (loadModules([
                "esri/identity/OAuthInfo",
                "esri/identity/IdentityManager",
                "esri/portal/Portal",
            ]) as Promise<Modules>);

            this.oauthInfo = new OAuthInfo({
                appId,
                popup: false,
                portalUrl
            });

            IdentityManager.useSignInPage = false;

            IdentityManager.registerOAuthInfos([this.oauthInfo]);

            this.esriId = IdentityManager;

            const credential:ICredential = await this.esriId.checkSignInStatus(this.oauthInfo.portalUrl + "/sharing");
            
            // init paortal
            const portal = new Portal({ url: portalUrl });
            // Setting authMode to immediate signs the user in once loaded
            portal.authMode = "immediate";

            // Once loaded, user is signed in
            const portalLoadRes = await portal.load();

            return ({
                credential,
                portal
            });
            
        } catch(err){
            return(null);
        }
    }

    sigIn(){
        this.esriId.getCredential(this.oauthInfo.portalUrl + "/sharing").then((res:any)=>{
            console.log('signed in as', res.userId);
        });
    }

    signOut(){
        this.esriId.destroyCredentials();
        window.location.reload();
    }
};