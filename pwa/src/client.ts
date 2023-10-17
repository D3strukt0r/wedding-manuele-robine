import { HoudiniClient } from '$houdini';
import { browser } from '$app/environment';

let url;
if (browser) {
  const { env } = await import('$env/dynamic/public');
  url = env.PUBLIC_API_URL;
} else {
  const { env } = await import('$env/dynamic/private');
  url = env.API_URL;
}

export default new HoudiniClient({
   url,

  // uncomment this to configure the network call (for things like authentication)
  // for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
  // fetchParams({ session }) {
  //   return {
  //     headers: {
  //       Authentication: `Bearer ${session.token}`,
  //     }
  //   }
  // }
});
