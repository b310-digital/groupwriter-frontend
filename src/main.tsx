import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import './i18n';
import LandingPage from './pages/LandingPage';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/document" element={<Navigate to="/" />} />
          <Route path="/document/:id" element={<App />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
