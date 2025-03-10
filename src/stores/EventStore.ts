// src/stores/EventStore.ts
import { observable, action, makeObservable, runInAction } from "mobx";
import api from "../app/api/api";
import { EventData, EventResponse } from "../types/EventData";

class EventStore {
  @observable data: EventData[] = [];
  @observable loading: boolean = false;
  @observable error: string | null = null;
  @observable currentPage: number = 1;
  @observable pageSize: number = 10;
  @observable totalItems: number = 0;
  @observable sorting: { id: string; desc: boolean }[] = [];
  @observable companyId: string = "2"; // 기본 회사 ID

  constructor() {
    makeObservable(this);
  }

  @action
  async fetchEvents(apiEndpoint: string) {
    this.loading = true;
    this.error = null;

    try {
      // api 인스턴스를 사용하여 POST 요청
      const response = await api.post<EventResponse>(apiEndpoint, {
        companyId: this.companyId,
        page: this.currentPage,
        limit: this.pageSize,
        // 정렬 정보가 필요하다면 추가
        // sort: this.sorting.length > 0 ? `${this.sorting[0].id}:${this.sorting[0].desc ? 'desc' : 'asc'}` : undefined
      });

      runInAction(() => {
        // 응답에서 이벤트 목록과 총 아이템 수 가져오기
        this.data = response.data.eventList;
        this.totalItems = response.data.totCnt;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "이벤트 데이터를 불러오는 중 오류가 발생했습니다.";
        console.error("API 오류:", error);
        this.loading = false;
      });
    }
  }

  @action
  setPage(page: number) {
    this.currentPage = page;
  }

  @action
  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // 페이지 크기 변경 시 첫 페이지로
  }

  @action
  setSorting(sorting: { id: string; desc: boolean }[]) {
    this.sorting = sorting;
  }

  @action
  setCompanyId(id: string) {
    this.companyId = id;
  }

  // 총 페이지 수 계산
  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}

// 스토어 인스턴스 생성
const eventStore = new EventStore();

export default eventStore;
