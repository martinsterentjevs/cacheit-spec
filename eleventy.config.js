module.exports = function (eleventyConfig) {
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "styling"
        }
    };
};