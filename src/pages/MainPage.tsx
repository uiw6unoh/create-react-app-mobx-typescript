import React from "react";
import DataTable from "../components/DataTable";
import MobxDataTable from "../components/MobXDataTable";
import { createColumnHelper } from "@tanstack/react-table";

// 샘플 데이터 타입 정의
type UserData = {
  id: string;
  name: string;
  role: string;
  phase: string;
  chain: string;
  zip: string;
  addr: string;
  // 기타 필드...
};

const MainPage: React.FC = () => {
  // 컬럼 헬퍼 생성
  const columnHelper = createColumnHelper<UserData>();

  // 컬럼 정의
  const columns = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "이름",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: () => "역할",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phase", {
      header: () => "단계",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("chain", {
      header: () => "체인",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("zip", {
      header: () => "우편번호",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("addr", {
      header: () => "주소",
      cell: (info) => info.getValue(),
    }),
    // 필요한 추가 컬럼 정의
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">사용자 데이터 테이블</h1>

      <h2 className="text-xl font-semibold mb-4">기본 테이블 (React 상태 관리)</h2>
      <DataTable
        apiUrl="/api/users" // 실제 API URL로 변경
        columns={columns}
        initialPageSize={10}
        className="shadow-lg rounded-lg mb-10"
      />

      <h2 className="text-xl font-semibold mb-4">MobX 테이블 (MobX 상태 관리)</h2>
      <MobxDataTable
        apiUrl="/api/advanced-users" // 실제 API URL로 변경
        columns={columns}
        initialPageSize={10}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default MainPage;
