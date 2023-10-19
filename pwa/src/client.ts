import { HoudiniClient } from '$houdini';
import axios from 'axios';

// This script is loaded by client and server

export default new HoudiniClient({
   url: axios.defaults.baseURL,

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
