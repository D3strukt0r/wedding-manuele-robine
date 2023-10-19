import axios from 'axios';
import { env } from '$env/dynamic/public';

// Set different base URLs for client and server
axios.defaults.baseURL = env.PUBLIC_API_URL;
