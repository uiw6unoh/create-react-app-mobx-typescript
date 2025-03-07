import React, { useEffect } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { observer } from "mobx-react";
import tableStore from "../stores/TableStore";
import Pagination from "./Pagination";

interface MobxDataTableProps {
  apiUrl: string;
  columns: any[];
  initialPageSize?: number;
  className?: string;
}

const MobxDataTable: React.FC<MobxDataTableProps> = observer(
  ({ apiUrl, columns, initialPageSize = 10, className = "" }) => {
    // 정렬 상태 (React 상태로 관리하고 MobX 스토어와 동기화)
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // 컴포넌트 마운트 시 초기 설정
    useEffect(() => {
      tableStore.setPageSize(initialPageSize);
      fetchData();
    }, [apiUrl, initialPageSize]);

    // 정렬 상태가 변경될 때 스토어 업데이트 및 데이터 다시 가져오기
    useEffect(() => {
      tableStore.setSorting(sorting as any);
      fetchData();
    }, [sorting]);

    // 데이터 가져오기 함수
    const fetchData = () => {
      tableStore.fetchData(apiUrl);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
      tableStore.setPage(page);
      fetchData();
    };

    // 페이지 크기 변경 핸들러
    const handlePageSizeChange = (size: number) => {
      tableStore.setPageSize(size);
      fetchData();
    };

    // 테이블 설정
    const table = useReactTable({
      data: tableStore.data,
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
    if (tableStore.loading) {
      return <div className="flex justify-center items-center p-8">데이터를 불러오는 중...</div>;
    }

    // 에러 표시
    if (tableStore.error) {
      return <div className="text-red-500 p-4">{tableStore.error}</div>;
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
          currentPage={tableStore.currentPage}
          totalPages={tableStore.totalPages}
          totalItems={tableStore.totalItems}
          pageSize={tableStore.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    );
  }
);

export default MobxDataTable;
