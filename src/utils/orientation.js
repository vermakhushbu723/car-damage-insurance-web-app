// Best-effort screen-orientation control. Used to flip the device back to
// portrait automatically after the landscape-only camera flow, so the user
// doesn't have to physically rotate the phone to view /damage-review etc.
//
// Caveats:
//  - screen.orientation.lock() is unsupported on iOS Safari (silent no-op).
//  - On Android Chrome it requires the document to be in fullscreen mode,
//    so we request fullscreen first.
//  - requestFullscreen() and lock() must run inside a user-gesture handler
//    (e.g. a click), otherwise the browser rejects with a SecurityError.
//  - All failures are swallowed — the page should still render correctly
//    if the lock can't be applied; user just keeps rotating manually.

// Note: kept synchronous (no async/await) so the call chain stays inside
// the originating user-gesture context — async/await breaks it and the
// browser then rejects requestFullscreen() with a SecurityError.
const lockTo = (orientation) => {
    const tryLock = () => {
        try { return window.screen?.orientation?.lock?.(orientation)?.catch(() => {}); }
        catch { /* ignore */ }
    };
    try {
        const el = document.documentElement;
        if (document.fullscreenElement) {
            tryLock();
        } else if (el.requestFullscreen) {
            el.requestFullscreen().then(tryLock).catch(() => {});
        } else {
            tryLock();
        }
    } catch { /* ignore */ }
};

export const lockToPortrait = () => lockTo('portrait');
export const lockToLandscape = () => lockTo('landscape');

export const unlockOrientation = () => {
    try { window.screen?.orientation?.unlock?.(); } catch { /* ignore */ }
};
