import React from 'react';
import useUser from '../../hooks/useUser';

const ListUser = () => {
  const { users, loading, error } = useUser();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User List</h2>
        {loading && <div className="text-center py-4">Đang tải dữ liệu...</div>}
        {error && (
          <div className="text-center py-4 text-red-500">
            Lỗi tải dữ liệu người dùng!
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Họ tên
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  SĐT
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Địa chỉ
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Vai trò
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Trạng thái
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Giới tính
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.fullname}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">{user.address}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.status}</td>
                  <td className="px-4 py-2">{user.gender}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-blue-500 hover:underline text-sm">
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500">
              Không có người dùng nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListUser;
