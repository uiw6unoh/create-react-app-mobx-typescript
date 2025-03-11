import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { observer } from "mobx-react";
import { EventData } from "../types/EventData";
import eventStore from "../stores/EventStore";
import DataTable from "../components/DataTable";
import { MenuItem } from "../components/ContextMenu";

const EventTablePage: React.FC = observer(() => {
  const [companyId] = useState("2");
  const apiUrl = "/gw/v1/RiskAreaList";

  // 컴포넌트 마운트 시 회사 ID 설정
  useEffect(() => {
    eventStore.setCompanyId(companyId);
  }, [companyId]);

  // 컬럼 정의
  const columnHelper = createColumnHelper<EventData>();
  const columns = [
    columnHelper.accessor("rowIndexNumber", {
      header: () => "번호",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("eventRulesetName", {
      header: () => "이벤트 규칙 이름",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cctvId", {
      header: () => "CCTV ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cctvName", {
      header: () => "CCTV 이름",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("regDate", {
      header: () => "등록일",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleString();
      },
    }),
    columnHelper.accessor("useYN", {
      header: () => "사용 여부",
      cell: (info) => (info.getValue() ? "활성" : "비활성"),
    }),
    columnHelper.accessor("eventRulesetId", {
      header: () => "이벤트 규칙 ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("videoChannelId", {
      header: () => "비디오 채널 ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("eventTypeCode", {
      header: () => "이벤트 유형",
      cell: (info) => info.getValue(),
    }),
  ];

  // 행에 대한 컨텍스트 메뉴 아이템
  const getRowMenuItems = (row: EventData): MenuItem[] => [
    {
      label: "추가",
      onClick: () => {
        console.log("수정", row);
        // 로직 추가
      },
    },
    {
      label: "삭제",
      onClick: () => {
        console.log("삭제", row);
        if (window.confirm(`정말로 "${row.eventRulesetName}"를 삭제하시겠습니까?`)) {
          // 로직 추가
        }
      },
    },
    {
      label: "대표안내로 연결",
      onClick: () => {
        console.log("대표안내로 연결", row);
        // 로직 추가
      },
    },
  ];

  // 빈 영역에 대한 컨텍스트 메뉴 아이템
  const emptyAreaMenuItems: MenuItem[] = [
    {
      label: "추가",
      onClick: () => {
        console.log("추가");
        // 로직 추가
      },
    },
    // {
    //   label: "데이터 새로고침",
    //   onClick: () => {
    //     console.log("데이터 새로고침");
    //     eventStore.fetchEvents(apiUrl);
    //   },
    // },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">CCTV 이벤트 테이블</h2>
      <DataTable
        apiUrl={apiUrl}
        columns={columns}
        store={eventStore}
        fetchMethod="fetchEvents"
        className="w-full shadow-lg rounded-lg"
        rowMenuItems={getRowMenuItems}
        emptyAreaMenuItems={emptyAreaMenuItems}
      />
    </div>
  );
});

export default EventTablePage;
