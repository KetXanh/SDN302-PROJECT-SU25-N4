import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, AlertCircle, CheckCircle, Folder } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Tên danh mục không được để trống';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Tên danh mục không được vượt quá 100 ký tự';
    }

    // Check duplicate name
    const duplicateCategory = categories.find(cat => 
      cat.name.toLowerCase().trim() === formData.name.toLowerCase().trim() &&
      (!editingCategory || cat._id !== editingCategory._id)
    );
    if (duplicateCategory) {
      errors.name = 'Tên danh mục đã tồn tại';
    }

    // Description validation (optional)
    if (formData.description && formData.description.trim().length > 500) {
      errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Open add modal
  const handleAddClick = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name, 
      description: category.description || '' 
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Save category
  const handleSaveCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      };

      let response;
      if (editingCategory) {
        response = await fetch(`http://localhost:3000/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`http://localhost:3000/api/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      const savedCategory = await response.json();

      if (editingCategory) {
        setCategories(prev => 
          prev.map(cat => cat._id === editingCategory._id ? savedCategory : cat)
        );
        showNotification('success', 'Cập nhật danh mục thành công!');
      } else {
        setCategories(prev => [...prev, savedCategory]);
        showNotification('success', 'Thêm danh mục thành công!');
      }

      closeModal();
    } catch (err) {
      console.error('Error saving category:', err);
      showNotification('error', err.message || `Không thể ${editingCategory ? 'cập nhật' : 'thêm'} danh mục. Vui lòng thử lại.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleteModalOpen(false);
    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      setCategories(prev => prev.filter(cat => cat._id !== categoryToDelete._id));
      showNotification('success', 'Xóa danh mục thành công!');
      setCategoryToDelete(null);
      
    } catch (err) {
      console.error('Error deleting category:', err);
      showNotification('error', err.message || 'Không thể xóa danh mục. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">Đang tải danh mục...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchCategories}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Quản lý Danh mục</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {categories.length} danh mục
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleAddClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có danh mục nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu bằng cách tạo danh mục đầu tiên cho sản phẩm của bạn.
            </p>
            <button
              onClick={handleAddClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Tạo danh mục đầu tiên
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm">
                        {category.description || (
                          <span className="text-gray-400 italic">Chưa có mô tả</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Xóa"
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
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                    formErrors.name 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  autoFocus
                  maxLength={100}
                />
                {formErrors.name && (
                  <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả danh mục..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none ${
                    formErrors.description 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  maxLength={500}
                />
                {formErrors.description && (
                  <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={!formData.name.trim() || submitting || Object.keys(formErrors).length > 0}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {submitting 
                  ? 'Đang lưu...' 
                  : (editingCategory ? 'Cập nhật' : 'Thêm')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc muốn xóa danh mục{' '}
                <span className="font-semibold">"{categoryToDelete?.name}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;