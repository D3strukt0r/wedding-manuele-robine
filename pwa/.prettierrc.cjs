// https://prettier.io/docs/en/options.html
// https://github.com/sveltejs/prettier-plugin-svelte#options
module.exports = {
  "useTabs": true,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"],
  "pluginSearchDirs": ["."],
  "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
};
