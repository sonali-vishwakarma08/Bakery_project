import React from 'react';
import UserCard from '../components/UserCard';

export default function Users() {
  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {users.map((user, idx) => (
        <UserCard key={idx} name={user.name} email={user.email} />
      ))}
    </div>
  );
}
