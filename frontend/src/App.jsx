import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import AddProductForm from './pages/AddProductForm'; // Import component AddProductForm
import EditProductForm from './pages/EditProductForm'; // Import component EditProductForm
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Ứng dụng Quản lý Sản phẩm</h1>
        </header>
        <main>
          <Routes>
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<AddProductForm />} />
            <Route path="/edit-product/:id" element={<EditProductForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;