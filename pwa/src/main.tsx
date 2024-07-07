import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { init as initI18n, currentLanguage } from './utils/i18n';
import axios from 'axios';

(async () => {
  // Set different base URLs for client and server
  axios.defaults.baseURL = document.documentElement.dataset.apiUrl;

  await initI18n(currentLanguage());

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');
  ReactDOM.createRoot(rootElement).render(
    <App />,
  ) /* .render(<React.StrictMode><App /></React.StrictMode>) */;
})();
