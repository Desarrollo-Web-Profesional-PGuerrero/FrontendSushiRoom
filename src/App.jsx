import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;