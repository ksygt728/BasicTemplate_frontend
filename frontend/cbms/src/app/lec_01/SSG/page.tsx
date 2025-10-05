interface User {
  userId: string;
  name: string;
  phoneNum: string;
  email: string;
  role: string;
  userType: string;
  gender: string;
}

// SSG: 빌드 타임에 데이터를 가져옴
async function getUsers(): Promise<User[]> {
  const res = await fetch("http://localhost:8080/admin/user/search", {
    cache: "force-cache", // SSG를 위해 캐시 활성화
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.data.data.content;
}

export default async function SSGPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        SSG (Static Site Generation)
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        이 페이지는 빌드 타임에 데이터를 가져와서 정적 페이지로 생성됩니다.
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
