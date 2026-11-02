import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Nie znaleziono elementu root.');
const app = <React.StrictMode><App /></React.StrictMode>;
if (root.querySelector('[data-app-root]')) hydrateRoot(root, app);
else createRoot(root).render(app);
