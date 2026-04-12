// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoProvider";
import { PedidoProvider } from "./context/PedidoProvider";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Experiencia from "./pages/Experiencia/Experiencia";
import { AdminProvider } from "./context/AdminProvider";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import ProductoDetalle from "./pages/ProductoDetalle/ProductoDetalle";
import Carrito from "./pages/Carrito/Carrito";
import EstadoPedido from "./pages/EstadoPedido/EstadoPedido";
import Checkout from "./pages/Checkout/Checkout";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminPanel from "./pages/Admin/AdminPanel";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import EmpleadoPanel from "./pages/Admin/EmpleadoPanel";
import ConfirmacionPedido from "./pages/ConfirmacionPedido/ConfirmacionPedido";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import TwoFactorVerify from './pages/TwoFactorVerify/TwoFactorVerify';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CarritoProvider>
          <PedidoProvider>
            <div className="app">
              <Header />
              <Breadcrumbs />
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
                    <PrivateRoute rolRequerido="admin">
                      <AdminPanel />
                    </PrivateRoute>
                  } />
                  <Route path="/empleado/panel" element={
                    <PrivateRoute rolRequerido="empleado">
                      <EmpleadoPanel />
                    </PrivateRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-2fa" element={<TwoFactorVerify />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="*" element={<NotFound />} />
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