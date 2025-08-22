import React from 'react';

const users = [
  { id: 1, name: 'Nguyen Van A', email: 'a@example.com' },
  { id: 2, name: 'Tran Thi B', email: 'b@example.com' },
  { id: 3, name: 'Le Van C', email: 'c@example.com' },
];

const ListUser = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User List</h2>
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button className="text-blue-500 hover:underline text-sm">View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListUser;
