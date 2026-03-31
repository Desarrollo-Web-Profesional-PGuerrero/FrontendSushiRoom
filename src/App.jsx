// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoProvider";
import { PedidoProvider } from "./context/PedidoProvider";
import { AdminProvider } from "./context/AdminProvider";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Experiencia from "./pages/Experiencia/Experiencia";
import ProductoDetalle from "./pages/ProductoDetalle/ProductoDetalle";
import Carrito from "./pages/Carrito/Carrito";
import EstadoPedido from "./pages/EstadoPedido/EstadoPedido";
import Checkout from "./pages/Checkout/Checkout";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminPanel from "./pages/Admin/AdminPanel";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CartIcon from "./components/CartIcon/CartIcon";
import ConfirmacionPedido from './pages/ConfirmacionPedido/ConfirmacionPedido';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CarritoProvider>
          <PedidoProvider>
            <div className="app">
              <Header />
              <CartIcon />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/experiencia" element={<Experiencia />} />
                  <Route path="/producto/:id" element={<ProductoDetalle />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/confirmacion" element={<ConfirmacionPedido />} />
                  <Route path="/estado-pedido/:id" element={<EstadoPedido />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/panel" element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
                  <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
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