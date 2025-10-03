/**
 * Loads Adobe Analytics script if the environment is suitable.
 * This function checks if the script can be loaded based on the current environment and hostname.
 *
 * @param {boolean} [hostedOnLivingAtlas=false] - Indicates if the application is hosted on Living Atlas.
 * @returns   {void}
 */
export const loadAdobeAnalytics = (hostedOnLivingAtlas = false) => {
    if (typeof window === 'undefined' || !window.document) {
        console.warn('Adobe Analytics cannot be loaded in this environment.');
        return;
    }

    if (hostedOnLivingAtlas === false) {
        console.warn(
            'Adobe Analytics is only loaded on livingatlas.arcgis.com.'
        );
        return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//mtags.arcgis.com/tags-min.js';
    document.head.appendChild(script);

    console.log('Adobe Analytics loaded successfully.');
};
