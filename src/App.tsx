import React from 'react';
import './App.css';
import Page from './components/Page';
import { Routes, Route } from 'react-router-dom'
import Admin from './components/Admin';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Page />} />
      <Route path='/admin' element={<Admin />} />
    </Routes>
  );
}

export default App;
