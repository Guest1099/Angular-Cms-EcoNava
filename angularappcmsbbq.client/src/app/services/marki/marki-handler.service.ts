import { Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Marka } from '../../models/marka';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MarkiService } from './marki.service';
import { SnackBarService } from '../snack-bar.service';
import { TaskResult } from '../../models/taskResult';
import { FormControl, FormGroup } from '@angular/forms';
import { GuidGenerator } from '../guid-generator';
import { InfoService } from '../InfoService';

@Injectable({
  providedIn: 'root'
})
export class MarkiHandlerService {

  displayedColumns: string[] = ['lp', 'name', 'action'];
  dataSource = new MatTableDataSource<Marka>();

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  searchFormControl = new FormControl('');

  marka!: Marka;
  marki: Marka[] = [];
  loadingElements: boolean = false;


  searchResultInformationStyle: any = {
    'display': 'none'
  }

  firstPositionStyle: any = {
    'display': 'none',
    'font-size': '30px',
    'border': '30px solid orange'
  }


  preloaderStyle: any = {
    'display': 'flex',
    'justify-content': 'center',
    'alignalign-items': 'center',
  }

  constructor(
    private markiService: MarkiService,
    private snackBarService: SnackBarService
  ) {
    this.getAll();
  }




  public initializeDataSource(paginator: MatPaginator, sort: MatSort): void {
    this.dataSource.paginator = paginator;
    this.dataSource.sort = sort;

    this.getAll();

    // czyszczenie kontrolki wyszukującej po odświeżeniu strony z wpisanego tekstu
    if (this.searchFormControl.dirty) {
      this.dataSource.filter = '';
      this.searchFormControl.setValue('');
    }

    this.searchResultInformationStyle.display = 'none';
  }
  


  public getAll(): void {
    this.markiService.getAll().subscribe({
      next: ((result: TaskResult<Marka[]>) => {
        if (result.success) {
          // pobranie danych
          this.marki = result.model as Marka[];
          this.dataSource.data = result.model as Marka [];


          if (this.marki.length > 0) {
            this.firstPositionStyle.display = 'none';
          } else {
            this.firstPositionStyle.display = 'block';
          }

          this.preloaderStyle.display = 'none';

        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('MarkiHandlerService', 'getAll')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }



  public get(id: any): Marka {
    this.markiService.get(id).subscribe({
      next: ((result: TaskResult<Marka>) => {
        if (result.success) {
          // pobranie danych
          this.marka = result.model as Marka;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('MarkiHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
    return this.marka;
  }



  public create(form: FormGroup): void {
    let sessionModel = localStorage.getItem('sessionModel');

    let marka: Marka = {
      markaId: GuidGenerator.newGuid().toString(),
      name: form.controls['name'].value
    };

    this.loadingElements = true;
    this.markiService.create(marka).subscribe({
      next: ((result: TaskResult<Marka>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Nowa pozycja została dodana');
          this.loadingElements = false;
          form.reset();
          form.markAllAsTouched();
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('MarkiHandlerService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }





  public edit(id: string, form: FormGroup): void {

    let marka: Marka = {
      markaId: id,
      name: form.controls['name'].value,
    };

    this.loadingElements = true;
    this.markiService.edit(id, marka).subscribe({
      next: ((result: TaskResult<Marka>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Nowa pozycja została zaktualizowana');
          this.loadingElements = false;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('MarkiHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });
  }





  public delete(id: string): void {
    this.loadingElements = true;
    this.markiService.delete(id).subscribe({
      next: ((result: TaskResult<Marka>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Pozycja zostsała usunięta');
          this.loadingElements = false;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('MarkiHandlerService', 'delete')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }





  public searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.marki.length > 0 && this.dataSource.filteredData.length == 0) {
      this.searchResultInformationStyle.display = 'block';
    } else {
      this.searchResultInformationStyle.display = 'none';
    }

  }








  public isValidCreate(form: FormGroup): boolean {
    if (
      form.controls['name'].touched && form.controls['name'].dirty && form.controls['name'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public isValidEdit(form: FormGroup): boolean {
    if (
      form.controls['name'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }



}

