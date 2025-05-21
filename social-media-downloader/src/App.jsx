import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';
import TwitterPage from './pages/TwitterPage';
import YouTubePage from './pages/YouTubePage';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/twitter" element={<TwitterPage />} />
        <Route path="/youtube" element={<YouTubePage />} />
      </Routes>
    </Router>
  );
}

export default App;
