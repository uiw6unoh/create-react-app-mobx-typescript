import React, { useEffect, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { observer } from "mobx-react";
import tableStore from "../stores/TableStore";
import ContextMenu, { MenuItem } from "./ui/ContextMenu";
import Popup from "./ui/Popup";

interface PopupInfo {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
}

interface DataTableProps {
  apiUrl: string;
  columns: any[];
  initialPageSize?: number;
  className?: string;
  store?: any;
  fetchMethod?: string;
  rowMenuItems?: (row: any) => MenuItem[];
  emptyAreaMenuItems?: MenuItem[];
  getRowClassName?: (row: any) => string;
}

const DataTable: React.FC<DataTableProps> = observer(
  ({
    apiUrl,
    columns,
    initialPageSize = 10,
    className = "",
    store = tableStore,
    fetchMethod = "fetchData",
    rowMenuItems,
    emptyAreaMenuItems,
    getRowClassName,
  }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    // 컨텍스트 메뉴 상태 관리
    const [contextMenu, setContextMenu] = useState<{
      visible: boolean;
      x: number;
      y: number;
      items: MenuItem[];
    }>({
      visible: false,
      x: 0,
      y: 0,
      items: [],
    });

    // 팝업 관리를 위한 상태 추가
    const [popups, setPopups] = useState<PopupInfo[]>([]);

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
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      manualPagination: true,
      debugTable: process.env.NODE_ENV === "development",
    });

    // 셀 더블클릭 핸들러
    const handleCellDoubleClick = (e: React.MouseEvent, cell: any) => {
      const value = cell.getValue();

      // 값이 없으면 팝업 표시 안함
      if (value === null || value === undefined || value === "") {
        return;
      }

      // 헤더 정보 가져오기
      const columnId = cell.column.id;
      const headerValue = columns.find((col) => col.id === columnId || col.accessorKey === columnId)?.header;
      const title = typeof headerValue === "function" ? headerValue() : headerValue || columnId;

      // 새 팝업 생성
      const newPopup: PopupInfo = {
        id: `popup-${Date.now()}`,
        title: String(title),
        content: String(value),
        position: { x: e.clientX, y: e.clientY },
      };

      setPopups((prevPopups) => [...prevPopups, newPopup]);
    };

    // 팝업 닫기 핸들러
    const handleClosePopup = (id: string) => {
      setPopups((prevPopups) => prevPopups.filter((popup) => popup.id !== id));
    };

    // 우클릭 핸들러 - 행
    const handleRowContextMenu = (e: React.MouseEvent, row: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (rowMenuItems) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          items: rowMenuItems(row.original),
        });
      }
    };

    // 우클릭 핸들러 - 빈 영역
    const handleEmptyAreaContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      if (emptyAreaMenuItems) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          items: emptyAreaMenuItems,
        });
      }
    };

    // 컨텍스트 메뉴 닫기
    const closeContextMenu = () => {
      setContextMenu({ ...contextMenu, visible: false });
    };

    return (
      <div className={`overflow-x-auto ${className}`} onContextMenu={handleEmptyAreaContextMenu}>
        <table className="min-w-full divide-y divide-gray-200 border-collapse text-xs">
          <thead className="bg-gray-400 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border border-gray-300"
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, idx) => {
                // 기본 행 스타일링 (홀/짝 행)
                let rowClassName = idx % 2 === 0 ? "bg-gray-50" : "bg-white";

                // 커스텀 행 스타일링 적용 (getRowClassName이 제공된 경우)
                if (getRowClassName) {
                  const customClass = getRowClassName(row.original);
                  if (customClass) {
                    rowClassName = customClass;
                  }
                }

                return (
                  <tr key={row.id} className={rowClassName} onContextMenu={(e) => handleRowContextMenu(e, row)}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-3 py-2 whitespace-nowrap text-gray-900 border border-gray-200"
                        onDoubleClick={(e) => handleCellDoubleClick(e, cell)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500 border border-gray-200">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {contextMenu.visible && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={closeContextMenu} />
        )}

        {popups.map((popup) => (
          <Popup
            key={popup.id}
            id={popup.id}
            title={popup.title}
            content={popup.content}
            initialPosition={popup.position}
            onClose={handleClosePopup}
          />
        ))}
      </div>
    );
  }
);

export default DataTable;
