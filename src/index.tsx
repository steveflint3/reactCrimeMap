import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const el = document.getElementById('app');

if (el === null) {
  throw new Error('App element does not exist')
}

createRoot(el).render(<App />);
