import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccountHandlerService } from '../../../../../services/account/account-handler.service';
import { ProductsHandlerService } from '../../../../../services/products/products-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { RejestratorLogowania } from '../../../../../models/rejestratorLogowania';
import { RejestratorLogowaniaHandlerService } from '../../../../../services/rejestratorLogowania/rejestrator-logowania-handler.service';
import { RejestratorLogowaniaDeleteComponent } from './rejestrator-logowania-delete/rejestrator-logowania-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { UsersHandlerService } from '../../../../../services/users/users-handler.service';

@Component({
  selector: 'app-rejestrator-logowania',
  templateUrl: './rejestrator-logowania.component.html',
  styleUrl: './rejestrator-logowania.component.css'
})
export class RejestratorLogowaniaComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public accountService: AccountHandlerService,
    public rejestratorLogowaniaService: RejestratorLogowaniaHandlerService,
    public usersService: UsersHandlerService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.rejestratorLogowaniaService.initializeDataSource(this.paginator, this.sort);
  }


  dataWylogowania (dataWylogowania: string): string {
    if (dataWylogowania.length > 0) {
      return dataWylogowania;
    } else {
      return 'zalogowany';
    }
  }

  czasZalogowania (czasZalogowania: string): string {
    if (czasZalogowania.length > 0) {
      return czasZalogowania;
    } else {
      return '-';
    }
  }



  openDialogDelete(rejestratorLogowania: RejestratorLogowania): void {
    let openRef = this.dialog.open(RejestratorLogowaniaDeleteComponent, {
      data: rejestratorLogowania
    });
    openRef.afterClosed().subscribe();
  }


}
