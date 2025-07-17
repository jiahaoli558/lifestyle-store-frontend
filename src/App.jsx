import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ui/ScrollToTop'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import PaymentPage from './pages/PaymentPage'
import TrackingSearchPage from './pages/TrackingSearchPage'
import TrackingPage from './pages/TrackingPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrderPage from './pages/AdminOrderPage'
import AdminUserPage from './pages/AdminUserPage'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext';
import './App.css'
import LoginPage from './pages/LoginPage'; // 新增
import RegisterPage from './pages/RegisterPage'; // 新增

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} /> 
              <Route path="/register" element={<RegisterPage />} /> 
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/tracking" element={<TrackingSearchPage />} />
              <Route path="/tracking/:trackingNumber" element={<TrackingPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrderPage />} />
              <Route path="/admin/users" element={<AdminUserPage />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </CartProvider>
  </AuthProvider>
  )
}

export default App
 

 

 
