// src/pages/EditProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, XCircle, Image, Package, DollarSign, FileText, ToggleLeft, ToggleRight } from 'lucide-react';

const EditProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    status: 'Available',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchCategoriesAndProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:3000/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Fetch product
        const productResponse = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!productResponse.ok) {
          throw new Error('Product not found');
        }
        const productData = await productResponse.json();
        setFormData({
          name: productData.name,
          price: productData.price,
          description: productData.description || '',
          image: productData.image?.url || productData.image || '',
          status: productData.status || 'Available',
          categoryId: productData.categoryId._id || productData.categoryId
        });
        setImagePreview(productData.image?.url || productData.image || '');
      } catch (err) {
        console.error('Không thể tải dữ liệu:', err);
        setError('Không thể tải dữ liệu sản phẩm hoặc danh mục.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Update image preview when image URL changes
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleStatusToggle = () => {
    const newStatus = formData.status === 'Available' ? 'Unavailable' : 'Available';
    setFormData(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi cập nhật sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/products')} 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="text-sm font-medium">Quay lại</span>
              </button>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Chỉnh sửa Sản phẩm</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-700">
                    Cập nhật sản phẩm thành công! Đang chuyển hướng...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">
                    Lỗi: {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name Input */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Package size={16} className="mr-2 text-blue-500" />
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  {/* Price Input */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="mr-2 text-green-500" />
                      Giá (VND)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập giá sản phẩm"
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      {formData.status === 'Available' ? (
                        <ToggleRight size={16} className="mr-2 text-green-500" />
                      ) : (
                        <ToggleLeft size={16} className="mr-2 text-red-500" />
                      )}
                      Trạng thái sản phẩm
                    </label>
                    <button
                      type="button"
                      onClick={handleStatusToggle}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        formData.status === 'Available'
                          ? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
                          : 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {formData.status === 'Available' ? (
                          <>
                            <ToggleRight size={18} />
                            Có Sẵn
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={18} />
                            Hết Hàng
                          </>
                        )}
                      </div>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Nhấn để chuyển đổi trạng thái sản phẩm
                    </p>
                  </div>

                  {/* Category Dropdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label htmlFor="categoryId" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Danh mục
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Image Input */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label htmlFor="image" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Image size={16} className="mr-2 text-red-500" />
                      URL Hình ảnh
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập URL hình ảnh sản phẩm"
                    />
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Xem trước hình ảnh:</p>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Product preview" 
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description Input */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FileText size={16} className="mr-2 text-indigo-500" />
                      Mô tả
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Nhập mô tả chi tiết về sản phẩm"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <XCircle size={18} className="mr-2" />
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <Save size={18} className="mr-2" />
                  {loading ? 'Đang cập nhật...' : 'Cập nhật Sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;