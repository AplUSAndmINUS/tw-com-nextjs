/**
 * Google AdSense configuration.
 *
 * Auto ads are enabled site-wide. The shared loader script is rendered from the
 * root layout so every page carries the same publisher registration.
 */

/** Google AdSense publisher ID */
export const ADSENSE_PUB_ID = 'ca-pub-7691902367885014';

/** Loader URL for the Auto ads script. */
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`;
