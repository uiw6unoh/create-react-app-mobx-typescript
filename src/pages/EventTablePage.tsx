// src/pages/EventTablePage.tsx
import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { observer } from "mobx-react";
import { EventData } from "../types/EventData";
import eventStore from "../stores/EventStore";
import DataTable from "../components/DataTable";

const EventTablePage: React.FC = observer(() => {
  const [companyId] = useState("2");

  // API 엔드포인트
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">CCTV 이벤트 테이블</h2>

      <DataTable
        apiUrl={apiUrl}
        columns={columns}
        store={eventStore}
        fetchMethod="fetchEvents"
        className="shadow-lg rounded-lg"
      />
    </div>
  );
});

export default EventTablePage;
