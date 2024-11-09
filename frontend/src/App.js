import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as React from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CustomEditor from './components/CustomEditor';
import VercelOAuth from './pages/VercelOAuth';

export default function App() {
  return (
    // routes for the website
    // /auth -> user login
    // /dashboard -> user dashboard
    // /project/:projectId -> main website editor
    // /vercel-oauth -> vercel oauth handler
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/project/:projectId" element={<CustomEditor />} />
        <Route path="/vercel-oauth" element={<VercelOAuth />} />
      </Routes>
    </BrowserRouter>
  );
}
