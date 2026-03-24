// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import CarritoResumen from './components/CarritoResumen/CarritoResumen'
import { CartProvider } from './context/CarritoContext';
import CartIcon from './components/CartIcon/CartIcon';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <CartIcon />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<CarritoResumen />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;