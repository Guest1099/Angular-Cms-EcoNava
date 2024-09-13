import { Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subcategory } from '../../models/subcategory';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SubcategoriesService } from './subcategories.service';
import { SnackBarService } from '../snack-bar.service';
import { TaskResult } from '../../models/taskResult';
import { Observable } from 'rxjs';
import { Category } from '../../models/category';
import { FormControl, FormGroup } from '@angular/forms';
import { GuidGenerator } from '../guid-generator';
import { InfoService } from '../InfoService';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesHandlerService {

  displayedColumns: string[] = ['lp', 'name', 'fullName', 'action'];
  dataSource = new MatTableDataSource<Subcategory>();

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  searchFormControl = new FormControl('');


  subcategory!: Subcategory;
  subcategories: Subcategory[] = [];
  loadingElements: boolean = false;
  displayErrorMessage: boolean = false;

  isLoadingTableElements: boolean = false;
  tablaZaladowana: boolean = false;

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
    private subcategoriesService: SubcategoriesService,
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
    this.subcategoriesService.getAll().subscribe({
      next: ((result: TaskResult<Subcategory[]>) => {
        if (result.success) {
          // pobranie danych 
          this.subcategories = result.model as Subcategory[];
          this.dataSource.data = result.model as Subcategory[];

          if (this.subcategories.length > 0) {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('SubcategoriesHandlerService', 'getAll')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }

  findCategoriesById(categoryId: string): Observable<Category[]> {
    return this.subcategoriesService.getAllByCategoryId(categoryId);
  }




  public get(id: any): void {
    this.subcategoriesService.get(id).subscribe({
      next: ((result: TaskResult<Subcategory>) => {
        if (result.success) {
          // pobranie danych
          this.subcategory = result.model as Subcategory;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('SubcategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }




  public create(form: FormGroup): void {

    let subcategory: Subcategory = {
      subcategoryId: GuidGenerator.newGuid().toString(),
      name: form.controls['name'].value,
      fullName: form.controls['fullName'].value,
      iloscOdwiedzin: 0,
      categoryId: form.controls['categoryId'].value,
    };

    this.loadingElements = true;
    this.subcategoriesService.create(subcategory).subscribe({
      next: ((result: TaskResult<Subcategory>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('SubcategoriesHandlerService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }





  public edit(id: string, form: FormGroup): void {

    let subcategory: Subcategory = {
      subcategoryId: id,
      name: form.controls['name'].value,
      fullName: form.controls['fullName'].value,
      iloscOdwiedzin: 0,
      categoryId: form.controls['categoryId'].value,
    };

    this.loadingElements = true;
    this.subcategoriesService.edit(id, subcategory).subscribe({
      next: ((result: TaskResult<Subcategory>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('SubcategoriesHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });
  }





  public delete(id: string): void {
    this.loadingElements = true;
    this.subcategoriesService.delete(id).subscribe({
      next: ((result: TaskResult<Subcategory>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('SubcategoriesHandlerService', 'delete')}. Name: ${error.name}. Message: ${error.message}`);
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

    if (this.subcategories.length > 0 && this.dataSource.filteredData.length == 0) {
      this.searchResultInformationStyle.display = 'block';
    } else {
      this.searchResultInformationStyle.display = 'none';
    }

  }






  public isValidCreate(form: FormGroup): boolean {
    if (
      form.controls['name'].touched && form.controls['name'].dirty && form.controls['name'].valid &&
      form.controls['fullName'].touched && form.controls['fullName'].dirty && form.controls['fullName'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public isValidEdit(form: FormGroup): boolean {
    if (
      form.controls['name'].valid &&
      form.controls['fullName'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


}
