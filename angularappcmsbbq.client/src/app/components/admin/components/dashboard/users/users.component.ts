import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccountHandlerService } from '../../../../../services/account/account-handler.service';
import { RolesHandlerService } from '../../../../../services/roles/roles-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationUser } from '../../../../../models/applicationUser';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UsersHandlerService } from '../../../../../services/users/users-handler.service';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;


  constructor(
    public accountService: AccountHandlerService,
    public usersService: UsersHandlerService,
    public roleService: RolesHandlerService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.usersService.initializeDataSource(this.paginator, this.sort);
  }



  openDialogDelete(user: ApplicationUser): void {
    let openRef = this.dialog.open(UserDeleteComponent, {
      data: user
    });
    openRef.afterClosed().subscribe();
  }



}
