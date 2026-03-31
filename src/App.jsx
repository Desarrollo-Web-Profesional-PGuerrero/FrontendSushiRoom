import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoProvider';
import { PedidoProvider } from './context/PedidoProvider';
import { AdminProvider } from './context/AdminProvider'; // Asegúrate que está importado
import AdminRoute from './components/AdminRoute/AdminRoute';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Experiencia from './pages/Experiencia/Experiencia';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import Carrito from './pages/Carrito/Carrito';
import EstadoPedido from './pages/EstadoPedido/EstadoPedido';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminPanel from './pages/Admin/AdminPanel';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>  {/* AdminProvider debe estar antes que CarritoProvider y PedidoProvider */}
        <CarritoProvider>
          <PedidoProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/experiencia" element={<Experiencia />} />
                  <Route path="/producto/:id" element={<ProductoDetalle />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/estado-pedido/:id" element={<EstadoPedido />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/panel" element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </PedidoProvider>
        </CarritoProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;