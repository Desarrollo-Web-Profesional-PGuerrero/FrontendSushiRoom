// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoProvider';
import { PedidoProvider } from './context/PedidoProvider';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import Carrito from './pages/Carrito/Carrito'; // De la rama gerardo
import EstadoPedido from './pages/EstadoPedido/EstadoPedido';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CarritoResumen from './components/CarritoResumen/CarritoResumen'; // De la rama main
import { CartProvider } from './context/CarritoContext'; // De la rama main
import CartIcon from './components/CartIcon/CartIcon'; // De la rama main
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CarritoProvider>
          <PedidoProvider>
            <div className="app">
              <Header />
              <CartIcon />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/producto/:id" element={<ProductoDetalle />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/estado-pedido/:id" element={<EstadoPedido />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </PedidoProvider>
        </CarritoProvider>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;