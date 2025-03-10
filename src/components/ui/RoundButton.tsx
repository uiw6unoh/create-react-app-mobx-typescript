"use client";
import classnames from "classnames";
import React, { PropsWithChildren } from "react";

type PaginationLinkProps = {
  page: number;
  active?: boolean;
  disabled?: boolean;
  onClick: React.Dispatch<React.SetStateAction<number>>;
} & PropsWithChildren;
export default function RoundButton({ page, children, ...props }: PaginationLinkProps) {
  return (
    <button
      className={classnames({
        "rounded-full text-[12px] leading-3 w-6 h-6": true,
        "bg-blurple text-white": props.active,
        "bg-white": !props.active,
        "pointer-events-none text-gray-200": props.disabled,
      })}
      onClick={() => props.onClick(page)}
    >
      {children}
    </button>
  );
}
