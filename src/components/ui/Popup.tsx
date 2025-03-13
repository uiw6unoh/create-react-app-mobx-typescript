import React, { useState, useRef, useEffect } from "react";

interface PopupProps {
  id: string;
  title: string;
  content: string;
  initialPosition: { x: number; y: number };
  onClose: (id: string) => void;
}

const Popup: React.FC<PopupProps> = ({ id, title, content, initialPosition, onClose }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 자동으로 클립보드에 복사
  useEffect(() => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setIsCopied(true);
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
      });
  }, [content]);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    if (popupRef.current && e.target === e.currentTarget) {
      const rect = popupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // 글로벌 마우스 이벤트 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={popupRef}
      className="fixed shadow-lg rounded z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "280px",
        backgroundColor: "white",
        border: "1px solid #ddd",
      }}
    >
      {/* 헤더 영역 - 드래그 가능 */}
      <div
        className="bg-gray-100 px-3 py-2 flex justify-between items-center cursor-move rounded-t"
        onMouseDown={handleMouseDown}
      >
        <div className="font-medium text-sm">{title}</div>
        <button onClick={() => onClose(id)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
          ✕
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-3">
        <div className="mb-3 break-words text-sm">
          {content}
          {/* <div className="text-xs text-green-600 mt-1">{isCopied ? "클립보드에 복사되었습니다." : ""}</div> */}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
            onClick={() => onClose(id)}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
