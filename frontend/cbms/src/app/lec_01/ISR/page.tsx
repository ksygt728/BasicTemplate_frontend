interface User {
  userId: string;
  name: string;
  phoneNum: string;
  email: string;
  role: string;
  userType: string;
  gender: string;
}

// ISR: 정적 페이지를 주기적으로 재생성
async function getUsers(): Promise<User[]> {
  const res = await fetch("http://localhost:8080/admin/user/search", {
    next: {
      revalidate: 60, // 60초마다 데이터 재검증
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.data.data.content;
}

export default async function ISRPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ISR (Incremental Static Regeneration)
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        이 페이지는 정적으로 생성되지만 60초마다 백그라운드에서 재생성됩니다.
      </p>
      <p className="text-sm text-blue-600 mb-8 text-center">
        현재 시간: {new Date().toLocaleString("ko-KR")}
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
