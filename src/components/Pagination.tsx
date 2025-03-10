"use client";
import usePagination from "@lucasmogari/react-pagination";
import React, { memo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import RoundButton from "./ui/RoundButton";

type Props = {
  pageNo: number;
  itemCount: number;
  perPage: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
};

export default memo(function Pagination({ pageNo, itemCount, perPage, setPageNum }: Props) {
  // use the usePagination hook
  // currentPage - current page
  // getPageItem - function that returns the type of page based on the index.
  // size - the number of pages
  const { currentPage, getPageItem, totalPages } = usePagination({
    totalItems: itemCount,
    page: pageNo,
    itemsPerPage: perPage,
    maxPageItems: 4,
  });
  const firstPage = 1;
  // calculate the next page
  const nextPage = Math.min(pageNo + 1, totalPages);
  // calculate the previous page
  const prevPage = Math.max(pageNo - 1, firstPage);
  // create a new array based on the total pages

  const arr = new Array(6);

  return (
    <div className="flex gap-0 items-center justify-center mt-3">
      {[...arr].map((_, i) => {
        // getPageItem function returns the type of page based on the index.
        // it also automatically calculates if the page is disabled.
        const { page, disabled } = getPageItem(i);
        if (page === "previous") {
          return (
            <div key={i} className="flex justify-center items-center">
              <div className="flex">
                <RoundButton page={1} disabled={disabled} onClick={setPageNum}>
                  <ChevronDoubleLeftIcon className="w-3 h-3" />
                </RoundButton>
              </div>
              <div className="flex">
                <RoundButton page={prevPage} disabled={disabled} onClick={setPageNum}>
                  <ChevronLeftIcon className="w-3 h-3" />
                </RoundButton>
              </div>
            </div>
          );
        }

        if (page === "gap") {
          return <span key={`${page}-${i}`}>...</span>;
        }

        if (page === "next") {
          return (
            <div key={i} className="flex justify-center items-center">
              <div className="flex">
                <RoundButton page={nextPage} disabled={disabled} onClick={setPageNum}>
                  <ChevronRightIcon className="w-3 h-3 " />
                </RoundButton>
              </div>
              <div className="flex">
                <RoundButton page={totalPages} disabled={disabled} onClick={setPageNum}>
                  <ChevronDoubleRightIcon className="w-3 h-3" />
                </RoundButton>
              </div>
            </div>
          );
        }

        return (
          <div key={i}>
            <RoundButton active={page === currentPage} page={page!} onClick={setPageNum}>
              {page}
            </RoundButton>
          </div>
        );
      })}
    </div>
  );
});
