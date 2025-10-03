// import { AGOL_PORTAL_ROOT } from '@shared/config';
// import { APP_LANGUAGE } from '@shared/constants/UI';
// import { initI18next } from '@shared/i18n/initI18next';
// import { initEsriOAuth } from '../esri-oauth';
import { initI18next } from '@utils/i18n';
import { loadAdobeAnalytics } from './loadAdobeAnalytics';
import { ARCGIS_PROTAL_ROOT } from '@constants/index';
import { initLogger } from '@utils/IndexedDBLogger';
import { initEsriOAuth } from '@utils/Esri-OAuth';
import { getCustomPortalUrl } from '@utils/LocalStorage';
import { setCustomWaybackConfig } from '@esri/wayback-core';

type InitAppParams = {
    /**
     * The application ID for the Esri OAuth.
     * This is required to initialize the OAuth flow.
     * Use undefined or an empty string if the app does not require OAuth.
     */
    appId: string;
};

/**
 * Check if the app is hosted on Living Atlas
 * If so, it should use ArcGIS Online as the portal URL
 */
const isHostedOnLivingAtlasServer =
    window.location.host === 'livingatlas.arcgis.com' ||
    window.location.host === 'livingatlasstg.arcgis.com';

/**
 * Initializes the application by setting up the necessary configurations.
 * This includes initializing i18next for internationalization, setting up Esri OAuth,
 * and loading Adobe Analytics if the application is hosted on Living Atlas.
 *
 * @param {string} params.appId - The application ID for the Esri OAuth.
 *                                 If the app does not require OAuth, this can be an empty string or undefined.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
export const initApp = async ({ appId }: InitAppParams): Promise<void> => {
    console.log('Initializing application...');

    // If the app is hosted on Living Atlas server, it must use ArcGIS Online as the portal URL
    // If the current portal URL is not ArcGIS Online, throw an error
    if (
        isHostedOnLivingAtlasServer &&
        ARCGIS_PROTAL_ROOT !== 'https://www.arcgis.com'
    ) {
        throw new Error(
            `This application is hosted on ${window.location.host} and must use ArcGIS Online (https://www.arcgis.com) as the portal URL. The current portal URL is "${ARCGIS_PROTAL_ROOT}". Please update it to "https://www.arcgis.com".`
        );
    }

    // Initialize Esri OAuth for authentication
    // This will set up the OAuth flow for the application using the provided appId and portal
    if (appId) {
        await initEsriOAuth({
            appId,
            portalUrl: getCustomPortalUrl() || ARCGIS_PROTAL_ROOT,
        });
    } else {
        // console.warn(
        //     'No appId provided for Esri OAuth initialization. Skipping OAuth setup.'
        // );
        throw new Error(
            'No appId provided for Esri OAuth initialization. Please add a valid appId in the environment variables.'
        );
    }

    // If there is a custom wayback config file URL in the environment variables, use it to set up the wayback config
    if (ENV_WAYBACK_CONFIG_FILE_URL) {
        const subDomains =
            ENV_WAYBACK_SUBDOMAINS &&
            Array.isArray(ENV_WAYBACK_SUBDOMAINS) &&
            ENV_WAYBACK_SUBDOMAINS.length > 0
                ? ENV_WAYBACK_SUBDOMAINS
                : undefined;
        // console.log('Using custom Wayback config file URL:', ENV_WAYBACK_CONFIG_FILE_URL);
        // console.log('Using Wayback subdomains:', subDomains);

        setCustomWaybackConfig({
            subDomains,
            waybackConfigFileURL: ENV_WAYBACK_CONFIG_FILE_URL,
        });
    }

    await initI18next();

    await initLogger();

    // Load Adobe Analytics script if the application is hosted on Living Atlas
    // This will append the Adobe Analytics script to the document head.
    loadAdobeAnalytics(isHostedOnLivingAtlasServer);

    console.log('Application initialized successfully.');
};
