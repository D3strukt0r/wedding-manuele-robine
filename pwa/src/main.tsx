import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {init as initI18n, currentLanguage} from './utils/i18n';
import axios from "axios";

(async () => {
  // Set different base URLs for client and server
  axios.defaults.baseURL = import.meta.env.MODE === 'development' ? 'https://api.wedding-manuele-robine.test' : 'https://api-wedding-manager.d3strukt0r.dev';

  await initI18n(currentLanguage());

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');
  ReactDOM.createRoot(rootElement).render(<App />)/*.render(<React.StrictMode><App /></React.StrictMode>)*/;
})();
