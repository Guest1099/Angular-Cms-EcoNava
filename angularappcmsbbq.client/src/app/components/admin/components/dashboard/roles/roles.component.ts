import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccountHandlerService } from '../../../../../services/account/account-handler.service';
import { RolesHandlerService } from '../../../../../services/roles/roles-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationRole } from '../../../../../models/applicationRole';
import { RoleDeleteComponent } from './role-delete/role-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedValue: string = 'versionA';

  constructor(
    public accountService: AccountHandlerService,
    public rolesService: RolesHandlerService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.rolesService.initializeDataSource(this.paginator, this.sort);
  }



  openDialogDelete(role: ApplicationRole): void {
    let openRef = this.dialog.open(RoleDeleteComponent, {
      data: role
    });
    openRef.afterClosed().subscribe();
  }


}
