export interface EventData {
  rowIndexNumber: number;
  eventRulesetName: string;
  cctvId: string;
  cctvName: string;
  pixelPolygonArea: number[][];
  wgsPolygonArea: any[];
  regDate: string;
  useYN: boolean;
  eventRulesetId: number;
  videoChannelId: number;
  eventTypeCode: string;
}

export interface EventResponse {
  header: {
    msg: string;
    cd: number;
  };
  totCnt: number;
  eventList: EventData[];
}
