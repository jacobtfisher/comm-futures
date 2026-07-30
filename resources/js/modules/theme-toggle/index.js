/**
 * Manual theme override for the footer toggle.
 *
 * The site follows prefers-color-scheme by default. This lets a reader
 * disagree with their OS for the length of the visit — sessionStorage, not
 * localStorage, so the choice survives navigation between pages but not the
 * tab. That keeps a two-state control honest: someone who picks dark at
 * midnight is not still pinned to it the next morning, and there is no need
 * for a third "system" state whose only job is to undo the other two.
 *
 * An absent key means no choice has been made, which is not the same as
 * choosing whatever the OS currently says. Nothing is written until the
 * control is used, so an untouched reader keeps following the system live.
 *
 * The pre-paint half of this lives inline in layouts/base.njk — the bundle is
 * deferred and would repaint after first paint.
 */

const ThemeToggle = function ThemeToggle()
{

    const STORAGE_KEY = 'theme'
    const toggle = document.querySelector('[data-theme-toggle]')

    if ( ! toggle ) return

    const query = window.matchMedia('(prefers-color-scheme: dark)')

    // sessionStorage throws rather than no-ops in Safari's private mode and
    // under a blocked-cookies policy, so every access is guarded. Losing the
    // override is survivable; taking the toggle down with it is not.
    const readStored = function readStored()
    {

        try { return window.sessionStorage.getItem(STORAGE_KEY) }
        catch ( e ) { return null }

    }

    const writeStored = function writeStored(theme)
    {

        try { window.sessionStorage.setItem(STORAGE_KEY, theme) }
        catch ( e ) {}

    }

    const currentTheme = function currentTheme()
    {

        const stored = readStored()

        if ( stored === 'dark' || stored === 'light' ) return stored

        return query.matches ? 'dark' : 'light'

    }

    // The mark is in an iframe, so it cannot see the attribute below or the
    // stylesheet that reads it — it only ever saw prefers-color-scheme, which
    // is exactly what the toggle is here to override. Same-origin, so the
    // target origin is pinned rather than '*'.
    const syncMark = function syncMark(theme)
    {

        const frame = document.querySelector('.hero-logo iframe')

        if ( ! frame || ! frame.contentWindow ) return

        frame.contentWindow.postMessage({ theme: theme }, window.location.origin)

    }

    const render = function render(theme)
    {

        toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')

    }

    const apply = function apply(theme)
    {

        document.documentElement.setAttribute('data-theme', theme)
        render(theme)
        syncMark(theme)

    }

    // Authored hidden so a failed bundle leaves no dead control in the footer.
    toggle.hidden = false
    render(currentTheme())

    // The iframe may or may not have finished by the time the deferred bundle
    // runs, so post now for the already-loaded case and again on load for the
    // other. Re-posting is just an attribute set, so the overlap is harmless.
    const frame = document.querySelector('.hero-logo iframe')

    if ( frame ) {

        syncMark(currentTheme())
        frame.addEventListener('load', function() { syncMark(currentTheme()) })

    }

    toggle.addEventListener('click', function() {

        const next = currentTheme() === 'dark' ? 'light' : 'dark'

        writeStored(next)
        apply(next)

    })

    // With no override the page follows the OS through the media query on its
    // own; only the button's state and the framed mark need telling. Once an
    // override exists it stays authoritative for the rest of the visit.
    query.addEventListener('change', function() {

        if ( readStored() ) return

        render(currentTheme())
        syncMark(currentTheme())

    })

}()

export default ThemeToggle
