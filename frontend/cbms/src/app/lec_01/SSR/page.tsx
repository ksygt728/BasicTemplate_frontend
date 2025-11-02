interface User {
  userId: string;
  name: string;
  phoneNum: string;
  email: string;
  role: string;
  userType: string;
  gender: string;
}

// SSR: 서버에서 매 요청마다 데이터를 가져옴
async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch("http://localhost:8080/admin/user/search", {
      cache: "no-store", // SSR을 위해 캐시 비활성화(기본값)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data.data.data.content;
  } catch (error) {
    console.warn("Failed to fetch users data:", error);
    // API 서버가 없을 경우를 대비한 fallback 데이터
    return [
      {
        userId: "demo-1",
        name: "Demo User 1",
        phoneNum: "010-1234-5678",
        email: "demo1@example.com",
        role: "USER",
        userType: "LOCAL",
        gender: "MALE",
      },
      {
        userId: "demo-2",
        name: "Demo User 2",
        phoneNum: "010-9876-5432",
        email: "demo2@example.com",
        role: "ADMIN",
        userType: "SOCIAL",
        gender: "FEMALE",
      },
    ];
  }
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
