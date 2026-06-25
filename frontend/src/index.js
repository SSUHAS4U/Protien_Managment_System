import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import './tailwind.generated.css';
import App from './App';

// Automatically rewrite localhost API endpoints to the live Render backend URL when running in production (Vercel)
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
  ? 'https://protien-managment-system.onrender.com' 
  : 'http://localhost:8080';

// 1. Intercept all Axios requests
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes('http://localhost:8080')) {
    config.url = config.url.replace('http://localhost:8080', API_BASE_URL);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Intercept all Fetch requests
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.includes('http://localhost:8080')) {
    input = input.replace('http://localhost:8080', API_BASE_URL);
  } else if (input instanceof URL && input.href.includes('http://localhost:8080')) {
    input = new URL(input.href.replace('http://localhost:8080', API_BASE_URL));
  } else if (input && typeof input === 'object' && input.url && input.url.includes('http://localhost:8080')) {
    const newUrl = input.url.replace('http://localhost:8080', API_BASE_URL);
    input = new Request(newUrl, input);
  }
  return originalFetch.call(this, input, init);
};

// Create the root container using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped with Router
root.render(
  <Router>
    <App />
  </Router>
);
