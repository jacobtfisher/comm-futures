/**
 * Generic show/hide disclosure.
 *
 * A `.disclosure-toggle` controls the element named in its aria-controls.
 * Currently used for the keynote abstract; the talk cards have their own
 * module because they also reorder and widen within the grid.
 *
 * Panels are authored open in the template and closed here on init, so if this
 * script never runs the content is readable rather than sealed behind a
 * control that will not respond.
 */

const Disclosure = function Disclosure()
{

    const toggles = Array.from(document.querySelectorAll('.disclosure-toggle'))

    if ( ! toggles.length ) return

    toggles.forEach(function(toggle) {

        const panel = document.getElementById(toggle.getAttribute('aria-controls'))

        if ( ! panel ) return

        const setState = function setState(open)
        {

            panel.hidden = ! open
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false')

        }

        setState(false)

        toggle.addEventListener('click', function() {

            setState(toggle.getAttribute('aria-expanded') !== 'true')

        })

    })

}()

export default Disclosure
