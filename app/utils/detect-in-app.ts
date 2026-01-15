
export function isInAppBrowser(): boolean {
    if (typeof window === 'undefined') return false;

    const ua = window.navigator.userAgent.toLowerCase();

    // Rules to identify in-app browsers
    // 'wv' is the standard indicator for Android WebViews
    const rules = [
        'instagram',
        'fban',      // Facebook
        'fbav',      // Facebook
        'twitter',
        'linkedin',
        'line',
        'whatsapp',
        'snapchat',
        'tiktok',
        'telegram',
        'wv',        // Generic Android WebView
        'z board',   // Mentioned by user, possibly "Z-Board" or specific ZTE user agent string component
        'zte'        // Adding ZTE just in case their browser identifies strongly as device manufacturer
    ];

    return rules.some((rule) => ua.includes(rule));
}
