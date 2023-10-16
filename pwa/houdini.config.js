/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  watchSchema: {
    // We don't have access to `import.meta.env` or `$env/dynamic/private`,
    // so we use this instead
    url: process.env.API_URL,
  },
  plugins: {
    'houdini-svelte': {},
  },
};

export default config;
