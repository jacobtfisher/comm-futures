const navigation = require('@11ty/eleventy-navigation')
const dates = require('./utilities/filters/dates')
const helpers = require('./utilities/filters/helpers')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

module.exports = config => {
  // navigation plugin
  config.addPlugin(navigation);

  // Human readable date for posts
  config.addFilter("dateDisplay", dates.friendly);

  // Timestamp for datetime element
  config.addFilter("timestamp", dates.timestamp);

  // Cache-bust a static asset URL with a short hash of its built contents.
  // The CSS/JS filenames never change, and GitHub Pages serves them with
  // Cache-Control: max-age=600, so for ~10 min after every deploy browsers
  // paired the new HTML with a stale main.min.css (e.g. an old .hero-logo
  // without border:0 → a default iframe box, plus the pre-fix margins). A
  // content hash gives each build a fresh URL, so updates apply immediately
  // and unchanged assets still cache long-term. Apply AFTER the `url` filter.
  config.addFilter("bust", (url) => {
    if (typeof url !== "string" || !url) return url;
    const [pathPart, query] = url.split("?");
    // Mix writes css/ and js/ at the repo root before Eleventy runs; images/
    // live there too. Fall back to the Eleventy output dir, then give up.
    const candidates = [
      path.join(__dirname, pathPart),
      path.join(__dirname, "public", pathPart),
    ];
    for (const file of candidates) {
      try {
        const hash = crypto
          .createHash("md5")
          .update(fs.readFileSync(file))
          .digest("hex")
          .slice(0, 8);
        return `${url}${query ? "&" : "?"}v=${hash}`;
      } catch (e) {
        // try the next candidate
      }
    }
    return url;
  });

  // Remove whitespace from a string
  config.addNunjucksFilter("spaceless", helpers.spaceless);

  // Minify our HTML
  config.addTransform(
    "htmlminify",
    require("./utilities/transforms/htmlminify")
  );

  // // Collections
  // config.addCollection("blog", (collection) => {
  //   const blogs = collection.getFilteredByTag("blog");

  //   for (let i = 0; i < blogs.length; i++) {
  //     const previous_post = blogs[i - 1];
  //     const next_post = blogs[i + 1];

  //     blogs[i].data["previous_post"] = previous_post;
  //     blogs[i].data["next_post"] = next_post;
  //   }

  //   return blogs.reverse();
  // });

  // // Categories collection
  // config.addCollection("categories", (collection) => {
  //   const list = new Set();

  //   collection.getAll().forEach((item) => {
  //     if (!item.data.tags) return;

  //     item.data.tags
  //       .filter((category) => !["blog", "all"].includes(category))
  //       .forEach((category) => list.add(category));
  //   });

  //   return Array.from(list).sort();
  // });

  // Shuffle filter

  // Random Filter: With the help from google search engine
  config.addNunjucksFilter("shuffle", function (array) {
    return helpers.shuffle(array);
  });

  config.addNunjucksFilter("find", function (arr=[], key="", value) {
  return arr?.filter(item => item[key] === value);
});

  module.exports = function (eleventyConfig) {
    eleventyConfig.ignores.add("_drafts/**");
    eleventyConfig.ignores.add("layouts/blog.njk");
    eleventyConfig.ignores.add("layouts/post.njk");
    eleventyConfig.ignores.add("layouts/category.njk");
  };

  // Layout aliases
  config.addLayoutAlias("base", "layouts/base.njk");
  config.addLayoutAlias("home", "layouts/home.njk");
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("organizers", "layouts/organizers.njk");
  config.addLayoutAlias("schedule", "layouts/schedule.njk");
  config.addLayoutAlias("presentations", "layouts/presentations.njk");
  config.addLayoutAlias("sponsorship", "layouts/sponsorship.njk");
  config.addLayoutAlias("contact", "layouts/contact.njk");
  config.addLayoutAlias("cfp", "layouts/cfp.njk");

  // Include our static assets
  config.addPassthroughCopy("css");
  config.addPassthroughCopy("js");
  config.addPassthroughCopy("images");
  config.addPassthroughCopy("globals");
  config.addPassthroughCopy("favicon.png");
  config.addPassthroughCopy("favicon.svg");
  config.addPassthroughCopy({"site/archive": "archive"});

  // Mix writes into css/ and js/; watch them so --serve recopies into public/
  // when assets rebuild (otherwise the browser keeps serving stale CSS/JS).
  config.addWatchTarget("css");
  config.addWatchTarget("js");
  config.addWatchTarget("images");

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    dir: {
      input: "site",
      output: "public",
      includes: "includes",
      data: "globals",
    },
  };
}
