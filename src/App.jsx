import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import { CartProvider } from './contexts/CartContext'
import './App.css'
import LoginPage from './pages/LoginPage'; // 新增
import RegisterPage from './pages/RegisterPage'; // 新增
import { AuthProvider } from './contexts/AuthContext'; // 新增

function App() {
  return (
    <CartProvider>
      <AuthProvider>
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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider> 
    </CartProvider>
  )
}

export default App
 
