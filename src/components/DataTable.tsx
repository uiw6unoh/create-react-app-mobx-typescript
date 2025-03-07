// src/components/DataTable.tsx
import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { observer } from "mobx-react";
import axios from "axios";
import Pagination from "./Pagination";

// 테이블에서 사용할 타입 정의 (실제 데이터에 맞게 수정 필요)
export type DataItem = {
  id: string;
  [key: string]: any; // 동적인 필드를 위한 인덱스 시그니처
};

// 컴포넌트 속성 타입 정의
interface DataTableProps {
  apiUrl: string;
  columns: any[];
  initialPageSize?: number;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = observer(({ apiUrl, columns, initialPageSize = 10, className = "" }) => {
  // 상태 관리
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 실제 API 엔드포인트에 맞게 파라미터 수정 필요
        const response = await axios.get(apiUrl, {
          params: {
            page: currentPage,
            limit: pageSize,
            // 정렬 정보가 필요하다면 추가
            // sort: sorting.length > 0 ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}` : undefined
          },
        });

        // 실제 데이터 구조에 맞게 수정
        setData(response.data.items || response.data); // 일반적으로 items 또는 data 필드에 배열이 있음

        // 총 아이템 수 (페이지네이션 계산용)
        setTotalItems(response.data.totalItems || response.data.length);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, currentPage, pageSize, sorting]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalItems / pageSize);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  // 테이블 설정
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 클라이언트 사이드 페이지네이션을 사용하지 않음 (서버에서 처리)
    manualPagination: true,
    debugTable: process.env.NODE_ENV === "development",
  });

  // 로딩 표시
  if (loading) {
    return <div className="flex justify-center items-center p-8">데이터를 불러오는 중...</div>;
  }

  // 에러 표시
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-500 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, idx) => (
            <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 독립된 페이지네이션 컴포넌트 사용 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
});

export default DataTable;
