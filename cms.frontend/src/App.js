import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home";
import NewsPage from "./pages/blog/NewsPage";
import PostDetailPage from "./pages/blog/BlogDetail";
import ContactPage from "./pages/contact";
import ProfilePage from "./pages/profile";
import CategoryProductsPage from "./pages/shop/CategoryProductsPage";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrderSuccessPage from "./pages/order-success";
import ProductDetailPage from "./pages/product-detail";
import ProductsPage from "./pages/products";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import "./assets/css/App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<PostDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
