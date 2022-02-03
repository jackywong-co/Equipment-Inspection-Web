import ReactDOM from 'react-dom';

import App from './App';

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthContextProvider } from './services/auth.context';

ReactDOM.render(
  <AuthContextProvider>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>,
  </AuthContextProvider>,
  document.getElementById('root')
);
