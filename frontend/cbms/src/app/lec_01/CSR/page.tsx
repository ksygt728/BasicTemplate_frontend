"use client";

import { useEffect, useState } from "react";

interface User {
  userId: string;
  name: string;
  phoneNum: string;
  email: string;
  role: string;
  userType: string;
  gender: string;
}

export default function CSRPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/admin/user/search");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();

        setUsers(data.data.data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        CSR (Client-Side Rendering)
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        이 페이지는 클라이언트에서 useEffect를 사용하여 데이터를 가져옵니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.userId}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              {user.name}
            </h2>
            <p className="text-gray-600 mb-1">📧 {user.email}</p>
            <p className="text-gray-600 mb-1">📞 {user.phoneNum}</p>
            <p className="text-gray-600">🌐로그인 타입 : {user.userType}</p>
            <p className="text-gray-600">Role : {user.role}</p>
            <p className="text-gray-600">Gender : {user.gender}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
