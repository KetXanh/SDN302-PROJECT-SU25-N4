// src/components/ProductList.jsx

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, MoreVertical, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authorAPI from '../api/base/authorApi';
const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const limit = 6;

  // State cho modal xác nhận xóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({
    success: false,
    message: '',
  });

  // Lấy dữ liệu sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // const response = await fetch(
      //   `http://localhost:3000/api/products?page=${currentPage}&limit=${limit}&search=${searchQuery}`
      // );

      const response = await authorAPI.get('/products', {
        params: {
          page: currentPage,
          limit,
          q: searchQuery,
        },
      });

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      const data = await response.data;
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  // Debouncing cho ô tìm kiếm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(inputValue);
      setCurrentPage(1); // Luôn về trang 1 khi tìm kiếm mới
    }, 500);

    return () => clearTimeout(timerId);
  }, [inputValue]);

  const handleAddProductClick = () => {
    navigate('/add-product');
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsModalOpen(false);
    setLoading(true);
    setDeleteStatus({ success: false, message: '' });

    try {
      await authorAPI.delete(`/products/${productToDelete._id}`);
      setDeleteStatus({ success: true, message: 'Xóa sản phẩm thành công!' });
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);

      // Tải lại dữ liệu để cập nhật lại phân trang
      fetchProducts();

    } catch (err) {
      setDeleteStatus({ success: false, message: 'Lỗi: Không thể xóa sản phẩm.' });
      console.error('Lỗi khi xóa sản phẩm:', err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setDeleteStatus({ success: false, message: '' });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-600 text-xl">⚠️</span>
            </div>
            <p className="text-gray-900 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Sản phẩm</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">📦</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {products.length}
                  </span> trên tổng số {totalPages * limit} sản phẩm
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                  autoFocus
                />
              </div>
              <button
                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center gap-2"
                onClick={handleAddProductClick}
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Delete status message */}
        {deleteStatus.message && (
          <div
            className={`p-4 rounded-md mb-4 ${deleteStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
          >
            {deleteStatus.message}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy thử tìm kiếm với từ khóa khác hoặc thêm sản phẩm mới.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="w-16 px-6 py-4 text-sm text-gray-500 text-left">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-md object-cover bg-gray-100"
                              src={product.image?.url || product.image}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4 truncate">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-40 px-6 py-4 text-sm font-medium text-gray-900 text-left">
                        {product.price.toLocaleString()} ₫
                      </td>
                      <td className="w-32 px-6 py-4 text-left">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.status === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {product.status === 'Available' ? 'Có sẵn' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="w-40 px-6 py-4 text-sm text-gray-500 text-left truncate">
                        {product.categoryId ? product.categoryId.name : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-left">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <nav className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  Trang trước
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  Trang sau
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa sản phẩm</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm "
              <span className="font-semibold">{productToDelete?.name}</span>" không?
              Thao tác này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;