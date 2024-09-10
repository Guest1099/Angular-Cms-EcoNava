import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class TablePageCounterService {

  constructor() { }

  // kod odpowiedzialny za wyświetlanie indexu w tabeli
  private currentPageIndex: number = 0;
  private pageSize: number = 5;

  onPageChange(event: PageEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getIndex(index: number): number {
    return this.currentPageIndex * this.pageSize + index + 1;
  }

  getCurrentPageIndex(): number {
    return this.currentPageIndex;
  }

  getPageSize(): number {
    return this.pageSize;
  }
}
