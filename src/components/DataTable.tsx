// src/components/DataTable.tsx
import React, { useEffect } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { observer } from "mobx-react";
import tableStore from "../stores/TableStore";

interface DataTableProps {
  apiUrl: string;
  columns: any[];
  initialPageSize?: number;
  className?: string;
  store?: any;
  fetchMethod?: string;
}

const DataTable: React.FC<DataTableProps> = observer(
  ({ apiUrl, columns, initialPageSize = 10, className = "", store = tableStore, fetchMethod = "fetchData" }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // 데이터 가져오기 함수
    const fetchData = () => {
      // 스토어에 지정된 메서드가 있는지 확인하고 호출
      if (typeof store[fetchMethod] === "function") {
        store[fetchMethod](apiUrl);
      } else {
        console.error(`Method ${fetchMethod} not found in store`);
      }
    };

    // 컴포넌트 마운트 시 초기 설정
    useEffect(() => {
      store.setPageSize(initialPageSize);
      fetchData();
    }, [apiUrl, initialPageSize, store, fetchMethod]);

    // 정렬 상태가 변경될 때 스토어 업데이트 및 데이터 다시 가져오기
    useEffect(() => {
      store.setSorting(sorting as any);
      fetchData();
    }, [sorting, store, fetchMethod]);

    // 테이블 설정
    const table = useReactTable({
      data: store.data,
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      manualPagination: true,
      debugTable: process.env.NODE_ENV === "development",
    });

    // 로딩 표시
    if (store.loading) {
      return (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // 에러 표시
    if (store.error) {
      return <div className="text-red-500 p-4 text-sm">{store.error}</div>;
    }

    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="min-w-full divide-y divide-gray-200 border-collapse text-xs">
          <thead className="bg-gray-400 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer border border-gray-300"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 whitespace-nowrap text-gray-900 border border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500 border border-gray-200">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

export default DataTable;
