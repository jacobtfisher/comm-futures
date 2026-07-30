
//==========  Laravel Mix  ==========//

const mix = require('laravel-mix')
const path = require('path')
require('laravel-mix-purgecss')

// Run Mix
mix

    // cleaner aliases for js module imports (optional)
    .webpackConfig({
        resolve: {
            alias: {
                '@utilities': path.resolve(__dirname, 'resources/js/utilities'),
                '@modules': path.resolve(__dirname, 'resources/js/modules')
            }
        }
    })

    // Compile Javascript
    .js('resources/js/main.js', 'js/')

    // Compile SCSS
    .sass('resources/scss/main.scss', 'css/')
    .options({ processCssUrls: false })


// Production only
if ( mix.inProduction() )
{

    // Purge our CSS
    // mix minifies CSS & JS by default
    // I prefer to add the `.min` suffix on the output files just for convention
    mix.purgeCss({
            content: ['site/**/*.njk'],
            // `is-open` is applied by resources/js/modules/talk-cards at runtime
            // and appears in no .njk file, so without safelisting it PurgeCSS
            // strips the expanded-card rules and clicking a talk does nothing
            // visible. Same reasoning as the existing menu-visible/expanded
            // entries for the mobile nav.
            safelist: ['menu-visible', 'loaded', 'expanded', 'is-open', 'bg-surface', 'color-ink', /^type-/, /^page-/, /[data-src]/],
            extractorPattern: [/[^<>"'`\s]*[^<>"'`\s:]/g]
        })
        .minify('css/main.css')
        .minify('js/main.js')

}


