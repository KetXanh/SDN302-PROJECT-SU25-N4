import React, { useState } from 'react';
import useUser from '../../hooks/useUser';

//Icon
import { Search } from 'lucide-react';
import { Edit2, Ban, CheckCircle, UserPlus, Eye, Download } from 'lucide-react';

// Modal components
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import UserDetailModal from './UserDetailModal';
import ConfirmModal from '../Common/ConfirmModal';
import ImportUserModal from './ImportUserModal';

const PAGE_SIZE = 5;

const ListUser = () => {
  // Parse currentUser from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const { users, loading, error, updateUser, banUser, activateUser, exportUsers, importUsers } = useUser();
  const [search, setSearch] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);

  const [page, setPage] = useState(1);

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmType, setConfirmType] = useState('default');

  // Lọc user theo tên, email, vai trò, trạng thái, số điện thoại
  const filteredUsers = users.filter((user) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return user._id !== '64a7f1f4f1d2c9b1c8e4e8a3';
    return (
      (user.fullname?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword)) &&
      user._id !== '64a7f1f4f1d2c9b1c8e4e8a3'
    );
  });

  // Pagination logic
  const totalPage = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleOpenDetail = (id) => {
    const user = filteredUsers.find((user) => user.id === id);
    setSelectedUser(user);
    setOpenDetail(true);
  };

  const handleBan = async (id) => {
    await banUser(id);
  };

  const handleActivate = async (id) => {
    await activateUser(id);
  };

  const handleOpenEdit = (id) => {
    const user = filteredUsers.find((user) => user.id === id);
    setSelectedUser(user);
    setOpenEdit(true);
  };

  // Hàm cập nhật user, truyền vào EditUserModal
  const handleUpdateUser = async (updatedUser) => {
    await updateUser(selectedUser.id, updatedUser);
    setOpenEdit(false);
    setSelectedUser(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPage) return;
    setPage(newPage);
  };

  // Reset page when search changes
  React.useEffect(() => {
    setPage(1);
  }, [search, users.length]);

  // Confirm ban/activate
  const handleConfirmBan = (id) => {
    setConfirmMessage('Bạn có chắc chắn muốn khóa người dùng này?');
    setConfirmAction(() => () => handleBan(id));
    setConfirmOpen(true);
    setConfirmType('ban');
  };

  const handleConfirmActivate = (id) => {
    setConfirmMessage('Bạn có chắc chắn muốn mở khóa người dùng này?');
    setConfirmAction(() => () => handleActivate(id));
    setConfirmOpen(true);
    setConfirmType('active');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Người dùng</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">👤</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {filteredUsers.length}
                  </span>{' '}
                  người dùng
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
              </div>
              {/* Export Button */}
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                onClick={exportUsers}
              >
                <Download size={18} />
                Xuất Excel
              </button>
              <button
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                onClick={() => setOpenImport(true)}
              >
                <Download size={18} />
                Import Excel
              </button>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                onClick={() => setOpenAdd(true)}
              >
                <UserPlus size={18} />
                Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal open={openAdd} onClose={() => setOpenAdd(false)} />

      {/* Edit User Modal */}
      <EditUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
        onEdit={handleUpdateUser}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        user={selectedUser}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
        type={confirmType}
      />

      {/* Import User Modal */}
      <ImportUserModal open={openImport} onClose={() => setOpenImport(false)} onUpload={importUsers} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Đang tải người dùng...</span>
          </div>
        )}
        {error && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-600 text-xl">⚠️</span>
              </div>
              <p className="text-gray-900 font-medium">{error.response.data?.message || error.response.data?.error || "Internal Server Error"}</p>
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy người dùng
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy thử tìm kiếm với từ khóa khác.
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
                      Họ tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SĐT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="w-16 px-6 py-4 text-sm text-gray-500 text-left">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-6 py-4 text-left">{user.fullname}</td>
                      <td className="px-6 py-4 text-left">{user.email}</td>
                      <td className="px-6 py-4 text-left">{user.phone}</td>
                      <td className="px-6 py-4 text-left">{user.address}</td>
                      <td className="px-6 py-4 text-left">{user.role}</td>
                      <td className="px-6 py-4 text-left">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">{user.gender}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {currentUser && currentUser.role === 'Admin' && currentUser.id === user.id && (
                            <button
                              className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                              onClick={() => handleOpenEdit(user.id)}
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}

                          {(user.status === 'Active') && user.role !== 'Admin' && (
                            <button
                              className="text-red-500 hover:bg-red-100 p-2 rounded"
                              onClick={() => handleConfirmBan(user.id)}
                              title="Ban"
                            >
                              <Ban size={18} />
                            </button>
                          )}
                          {(user.status === 'Banned' || user.status === 'Inactive') && user.role !== 'Admin' && (
                            <button
                              className="text-green-500 hover:bg-green-100 p-2 rounded"
                              onClick={() => handleConfirmActivate(user.id)}
                              title="Activate"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            className="text-gray-500 hover:bg-gray-100 p-2 rounded"
                            onClick={() => handleOpenDetail(user.id)}
                            title="Detail"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 py-6">
              <button
                className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                &lt;
              </button>
              {Array.from({ length: Math.max(totalPage, 1) }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded border ${page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === Math.max(totalPage, 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListUser;
