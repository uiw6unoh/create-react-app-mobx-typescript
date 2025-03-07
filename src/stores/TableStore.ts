import { observable, action } from "mobx";
import axios from "axios";

// 데이터 타입 (실제 API 응답에 맞게 수정 필요)
export interface TableData {
  id: string;
  [key: string]: any;
}

class TableStore {
  @observable data: TableData[] = [];
  @observable loading: boolean = false;
  @observable error: string | null = null;
  @observable currentPage: number = 1;
  @observable pageSize: number = 10;
  @observable totalItems: number = 0;
  @observable sorting: { id: string; desc: boolean }[] = [];

  @action
  async fetchData(apiUrl: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.get(apiUrl, {
        params: {
          page: this.currentPage,
          limit: this.pageSize,
        },
      });

      // runInAction 대신 직접 값 할당
      this.data = response.data.items || response.data;
      this.totalItems = response.data.totalItems || response.data.length;
      this.loading = false;
    } catch (error) {
      this.error = "데이터를 불러오는 중 오류가 발생했습니다.";
      this.loading = false;
    }
  }

  @action
  setPage(page: number) {
    this.currentPage = page;
  }

  @action
  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  @action
  setSorting(sorting: { id: string; desc: boolean }[]) {
    this.sorting = sorting;
  }

  // 계산된 속성
  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}

// 스토어 인스턴스 생성
const tableStore = new TableStore();

export default tableStore;
