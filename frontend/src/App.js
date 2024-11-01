import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as React from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';


const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}