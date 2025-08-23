// src/components/AddProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Package, DollarSign, Hash, Image, FileText, Tag, AlertCircle } from 'lucide-react';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Không thể tải danh mục:', err);
        setError('Không thể tải danh mục. Vui lòng kiểm tra lại backend.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Tên sản phẩm không được để trống';
        } else if (value.trim().length < 3) {
          errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
        } else if (value.trim().length > 100) {
          errors.name = 'Tên sản phẩm không được quá 100 ký tự';
        }
        break;
      
      case 'price':
        if (!value) {
          errors.price = 'Giá sản phẩm không được để trống';
        } else if (isNaN(value) || Number(value) <= 0) {
          errors.price = 'Giá sản phẩm phải là số dương';
        } else if (Number(value) > 1000000000) {
          errors.price = 'Giá sản phẩm không được quá 1 tỷ VND';
        }
        break;
      
      case 'stock':
        if (!value) {
          errors.stock = 'Số lượng tồn kho không được để trống';
        } else if (isNaN(value) || Number(value) < 0) {
          errors.stock = 'Số lượng tồn kho phải là số không âm';
        } else if (Number(value) > 1000000) {
          errors.stock = 'Số lượng tồn kho không được quá 1 triệu';
        } else if (!Number.isInteger(Number(value))) {
          errors.stock = 'Số lượng tồn kho phải là số nguyên';
        }
        break;
      
      case 'image':
        if (value && !isValidUrl(value)) {
          errors.image = 'URL hình ảnh không hợp lệ';
        }
        break;
      
      case 'description':
        if (value && value.length > 1000) {
          errors.description = 'Mô tả không được quá 1000 ký tự';
        }
        break;
      
      case 'categoryId':
        if (!value) {
          errors.categoryId = 'Vui lòng chọn danh mục';
        }
        break;
      
      default:
        break;
    }
    
    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Real-time validation
    const errors = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let allErrors = {};
    Object.keys(formData).forEach(field => {
      const errors = validateField(field, formData[field]);
      allErrors = { ...allErrors, ...errors };
    });
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };
      
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thêm sản phẩm');
      }

      setSuccess(true);
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        stock: '',
        categoryId: ''
      });
      setFieldErrors({});
      setTimeout(() => {
        setSuccess(false);
        navigate('/products');
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi thêm sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleNumberChange = (e, fieldName) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      handleChange({ target: { name: fieldName, value } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sáng giống ProductList */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Package className="w-6 h-6 text-gray-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            <XCircle className="w-5 h-5 mr-3 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
            <span className="font-medium">Sản phẩm đã được thêm thành công!</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cột 1: Thông tin cơ bản */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Thông Tin Cơ Bản</h2>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Tên Sản Phẩm *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          fieldErrors.name 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                        } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                        placeholder="Nhập tên sản phẩm..."
                      />
                      {fieldErrors.name && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.name}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Giá (VND) *
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price ? formatNumber(formData.price) : ''}
                        onChange={(e) => handleNumberChange(e, 'price')}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          fieldErrors.price 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                        } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                        placeholder="0"
                      />
                      {fieldErrors.price && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.price}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="stock" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Hash className="w-4 h-4 text-purple-600" />
                        Số Lượng Tồn Kho *
                      </label>
                      <input
                        type="text"
                        id="stock"
                        name="stock"
                        value={formData.stock ? formatNumber(formData.stock) : ''}
                        onChange={(e) => handleNumberChange(e, 'stock')}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          fieldErrors.stock 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                        placeholder="0"
                      />
                      {fieldErrors.stock && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.stock}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột 2: Hình ảnh và mô tả */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Image className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Hình Ảnh & Mô Tả</h2>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Image className="w-4 h-4 text-blue-600" />
                        URL Hình Ảnh
                      </label>
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          fieldErrors.image 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                        } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                        placeholder="https://example.com/image.jpg"
                      />
                      {fieldErrors.image && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.image}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 text-orange-600" />
                        Mô Tả Sản Phẩm
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          fieldErrors.description 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                        } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none`}
                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                      ></textarea>
                      {fieldErrors.description && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {formData.description.length}/1000 ký tự
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột 3: Danh mục và nút submit */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Tag className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Phân Loại</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="categoryId" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      Danh Mục *
                    </label>
                    {categoriesLoading ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          Đang tải danh mục...
                        </div>
                      </div>
                    ) : (
                      <>
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            fieldErrors.categoryId 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                          } focus:ring-4 transition-all duration-200 bg-white text-gray-900`}
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.categoryId && (
                          <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {fieldErrors.categoryId}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={loading || categoriesLoading || Object.keys(fieldErrors).some(key => fieldErrors[key])}
                      className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                        loading || categoriesLoading || Object.keys(fieldErrors).some(key => fieldErrors[key])
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang thêm sản phẩm...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Package className="w-5 h-5" />
                          Thêm Sản Phẩm
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;