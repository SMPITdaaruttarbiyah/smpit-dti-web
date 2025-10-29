module.exports = function(eleventyConfig) {
  // Copy admin folder to _site
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Add markdown support
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.page.inputPath.includes("index.md")) {
        return "/";
      }
      return data.page.filePathStem.replace(/^\/_/, "/") + "/";
    }
  });

  // Add collection for pages
  eleventyConfig.addCollection("pages", function(collection) {
    return collection.getFilteredByGlob("src/**/*.md");
  });

  // Add collection for berita
  eleventyConfig.addCollection("berita", function(collection) {
    return collection.getFilteredByGlob("src/berita/**/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: "/smpit-dti-web/"
  };
};