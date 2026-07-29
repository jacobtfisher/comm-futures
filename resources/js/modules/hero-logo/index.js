// Animated mark ships in the HTML. Swap to the static PNG only when the
// user prefers reduced motion — avoids preloading the PNG and flashing it
// before the iframe appears.

const root = document.querySelector('[data-hero-logo-anim]')

if (root && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const src = root.getAttribute('data-hero-logo-static')
    const iframe = root.querySelector('.hero-logo__media')

    if (src) {
        const img = document.createElement('img')
        img.className = 'hero-logo__media'
        img.src = src
        img.alt = ''
        img.width = 789
        img.height = 795

        if (iframe) {
            iframe.replaceWith(img)
        } else {
            root.appendChild(img)
        }
    }
}
