interface User {
  userId: string;
  name: string;
  phoneNum: string;
  email: string;
  role: string;
  userType: string;
  gender: string;
}

interface Props {
  users: User[];
}

// SSR: 서버에서 매 요청마다 데이터를 가져옴
async function getUsers(): Promise<User[]> {
  const res = await fetch("http://localhost:8080/admin/user/search", {
    cache: "no-store", // SSR을 위해 캐시 비활성화(기본값)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.data.data.content;
}

export default async function SSRPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        SSR (Server-Side Rendering)
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        이 페이지는 서버에서 매 요청마다 데이터를 가져와서 렌더링합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.userId}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
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
