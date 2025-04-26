import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router";
import AuthProvider from "./providers/Auth0Provider/Auth0Provider.jsx";
import AuthTokenHandler from "./helpers/AuthTokenHandler.jsx";

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <AuthTokenHandler />
        <App />
    </AuthProvider>
);


