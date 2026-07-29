/**
 * Expandable stage-talk cards on the schedule page.
 *
 * Talks used to live on generated /agenda-items/item-N/ detail pages. The
 * abstract now opens in place: the clicked card widens across the whole grid
 * row (CSS handles that via `grid-column: 1 / -1` on .is-open) and reveals its
 * panel, with grid repacking the surrounding cards.
 *
 * The panels are authored open and closed here on init, so with JS disabled or
 * still loading every abstract is readable rather than sealed behind a control
 * that will never respond.
 *
 * Open titles start at the display size in CSS; fitTitle() steps them down so
 * a long wrap (Chen Crystal, Pennebaker-length abstracts aside) stays within
 * about four lines instead of blowing out the left column.
 */

const TalkCards = function TalkCards()
{

    const cards = Array.from(document.querySelectorAll('.agenda-card'))

    if ( ! cards.length ) return

    const panelFor = card => card.querySelector('.agenda-card-panel')
    const triggerFor = card => card.querySelector('.agenda-card-trigger')
    const titleFor = card => card.querySelector('.item-title')

    // Cap open titles at roughly four lines of the stylesheet size. Steps the
    // computed font-size down until scrollHeight fits, with a floor so a
    // pathological title cannot shrink into unreadability.
    const fitTitle = function fitTitle(card)
    {

        const title = titleFor(card)

        if ( ! title ) return

        title.style.fontSize = ''

        const styles = window.getComputedStyle(title)
        const computedSize = parseFloat(styles.fontSize)

        if ( ! computedSize ) return

        const lineHeight = parseFloat(styles.lineHeight) || computedSize * 1.2
        const maxHeight = lineHeight * 4
        let size = computedSize
        const floor = Math.max(computedSize * 0.7, 17)

        while ( title.scrollHeight > maxHeight + 1 && size > floor )
        {

            size -= 0.5
            title.style.fontSize = size + 'px'

        }

    }

    const clearTitleFit = function clearTitleFit(card)
    {

        const title = titleFor(card)

        if ( title ) title.style.fontSize = ''

    }

    const close = function close(card)
    {

        const panel = panelFor(card)
        const trigger = triggerFor(card)

        card.classList.remove('is-open')
        clearTitleFit(card)
        if ( panel ) panel.hidden = true
        if ( trigger ) trigger.setAttribute('aria-expanded', 'false')

    }

    const open = function open(card)
    {

        const panel = panelFor(card)
        const trigger = triggerFor(card)

        card.classList.add('is-open')
        if ( panel ) panel.hidden = false
        if ( trigger ) trigger.setAttribute('aria-expanded', 'true')

        // Measure after the open layout (side-by-side columns) has applied.
        fitTitle(card)

    }

    // Start collapsed. Doing this in JS rather than with a `hidden` attribute in
    // the template is what keeps the no-JS view usable.
    cards.forEach(close)

    cards.forEach(function(card) {

        const trigger = triggerFor(card)

        if ( ! trigger ) return

        trigger.addEventListener('click', function() {

            const isOpen = card.classList.contains('is-open')

            // Accordion: only one abstract at a time, otherwise several
            // full-width cards stack and the grid stops reading as a grid.
            cards.forEach(close)

            if ( ! isOpen )
            {

                open(card)

                // The open card moves to the front of the grid (CSS `order: -1`),
                // so clicking one in a lower row jumps it upward past the
                // scroll position. Pull it back into view when that happens,
                // but leave the page alone when the card is already visible so
                // ordinary clicks don't scroll under the reader.
                const box = card.getBoundingClientRect()

                if ( box.top < 0 || box.bottom > window.innerHeight )
                {

                    card.scrollIntoView({ block: 'nearest', behavior: 'smooth' })

                }

            }

        })

    })

    // Deep links from elsewhere on the site (or a shared URL) still land on a
    // specific talk: #talk-7 opens that card instead of just jumping to it.
    const openFromHash = function openFromHash()
    {

        const id = window.location.hash

        if ( ! id || id.indexOf('#talk-') !== 0 ) return

        const card = document.querySelector(id)

        if ( ! card || ! card.classList.contains('agenda-card') ) return

        cards.forEach(close)
        open(card)
        card.scrollIntoView({ block: 'center' })

    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)

    // Re-fit the open title when the left column width changes.
    window.addEventListener('resize', function() {

        const openCard = document.querySelector('.agenda-card.is-open')

        if ( openCard ) fitTitle(openCard)

    })

}()

export default TalkCards
