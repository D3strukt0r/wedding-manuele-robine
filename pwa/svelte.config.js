import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),

    // https://kit.svelte.dev/docs/configuration#csp
    csp: {
      directives: {
        'default-src': ['none'],
        'script-src': ['self'],
        'connect-src': ['self', /*process.env.PUBLIC_API_URL*/], // TODO: Fix Connect url for GraphQL
        'img-src': ['self'],
        'manifest-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
        'font-src': ['self'],
        'base-uri': ['self'],
        'form-action': ['self'],
        'frame-ancestors': ['none'],
      },
      // Must be specified with either the `report-to` or `report-uri` directives, or both
      // reportOnly: {
      //   'script-src': ['self'],
      // },
    },

    alias: {
      $houdini: path.resolve('.', '$houdini'),
    },
  },
};

export default config;
