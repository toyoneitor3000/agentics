
export function isInAppBrowser(): boolean {
    if (typeof window === 'undefined') return false;

    const ua = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;

    // Rules to identify in-app browsers
    const rules = [
        'Instagram', // Instagram
        'FBAN',      // Facebook
        'FBAV',      // Facebook
        'Twitter',   // Twitter
        'LinkedIn',  // LinkedIn
        'Line',      // Line
        'WhatsApp',  // WhatsApp (sometimes uses webview for links)
        'Snapchat',  // Snapchat
    ];

    return rules.some((rule) => ua.indexOf(rule) > -1);
}
