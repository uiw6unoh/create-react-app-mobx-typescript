import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  className = "",
}) => {
  // 페이지 번호 목록 생성 헬퍼 함수
  const getPageNumbers = (): (string | number)[] => {
    const pageNumbers: (string | number)[] = [];

    if (totalPages <= 7) {
      // 총 페이지가 7개 이하면 모든 페이지 번호 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지 주변과 첫/마지막 페이지 표시
      pageNumbers.push(1);

      if (currentPage < 4) {
        // 현재 페이지가 앞쪽이면
        pageNumbers.push(2, 3, 4, 5, "...", totalPages);
      } else if (currentPage > totalPages - 4) {
        // 현재 페이지가 뒤쪽이면
        pageNumbers.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // 현재 페이지가 중간이면
        pageNumbers.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 ${className}`}
    >
      {/* 모바일 화면용 간소화된 페이지네이션 */}
      <div className="flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50"
        >
          다음
        </button>
      </div>

      {/* 데스크톱 화면용 확장된 페이지네이션 */}
      <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
        <div>
          <p className="text-sm text-gray-700">
            총 <span className="font-medium">{totalPages}</span> 페이지 중{" "}
            <span className="font-medium">{currentPage}</span> 페이지
            {totalItems !== undefined && (
              <span className="ml-2">
                (총 <span className="font-medium">{totalItems}</span>개 항목)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onPageSizeChange && (
            <>
              <span className="text-sm text-gray-700 mr-2">페이지 크기:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </>
          )}

          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm ml-2" aria-label="Pagination">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
              title="처음 페이지"
            >
              {"<<"}
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              title="이전 페이지"
            >
              {"<"}
            </button>

            {/* 현재 페이지 주변의 페이지 번호 표시 */}
            {getPageNumbers().map((pageNum, i) =>
              pageNum === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => onPageChange(Number(pageNum))}
                  className={`relative inline-flex items-center px-4 py-2 text-sm ${
                    currentPage === Number(pageNum)
                      ? "bg-blue-50 text-blue-600 border-blue-500 z-10"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                  } border`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              title="다음 페이지"
            >
              {">"}
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
              title="마지막 페이지"
            >
              {">>"}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
