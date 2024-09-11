import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountHandlerService } from '../../../../services/account/account-handler.service';
import { RolesHandlerService } from '../../../../services/roles/roles-handler.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { AccountService } from '../../../../services/account/account.service';
import { LoginViewModel } from '../../../../models/loginViewModel';
import { TaskResult } from '../../../../models/taskResult';
import { InfoService } from '../../../../services/InfoService';
import { RejestratorLogowaniaHandlerService } from '../../../../services/rejestratorLogowania/rejestrator-logowania-handler.service';
import { RejestratorLogowania } from '../../../../models/rejestratorLogowania';
import { GuidGenerator } from '../../../../services/guid-generator';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  formGroupLogin !: FormGroup;
  formGroupRegister !: FormGroup;
  navigation!: any;
  isSidenavOpen = false;
  password: string = 'SDG%$@5423sdgagSDert';

  zalogowanyUserEmail: string | undefined = '';
  role: string = '';
  logowanie: boolean = false;
  isLoggedIn: boolean = false;


  constructor(
    private fb: FormBuilder,
    public accountHandlerService: AccountHandlerService,
    public roleService: RolesHandlerService,
    public rejestratorLogowaniaService: RejestratorLogowaniaHandlerService,
    private router: Router,
    private snackBarService: SnackBarService,
    public accountService: AccountService,
  ) { }


  ngOnInit(): void {

    // formularz logowania
    this.formGroupLogin = this.fb.group({
      emailLogin: ['admin@admin.pl', [Validators.required]],
      passwordLogin: ['SDG%$@5423sdgagSDert', [Validators.required]]
    });


    // formularz rejestracji
    this.formGroupRegister = this.fb.group({
      emailRegister: ['', [Validators.required, Validators.email]],
      passwordRegister: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/]).{8,}$/)]],
      imie: ['', [Validators.required]],
      nazwisko: ['', [Validators.required]],
      ulica: ['', [Validators.required]],
      numerUlicy: ['', [Validators.required]],
      miejscowosc: ['', [Validators.required]],
      kraj: ['', [Validators.required]],
      kodPocztowy: ['', [Validators.required]],
      dataUrodzenia: ['', [Validators.required]],
      telefon: ['', [Validators.required]],
    });

    this.formGroupLogin.markAllAsTouched();
    this.formGroupRegister.markAllAsTouched();


    let sessionModel = sessionStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      this.zalogowanyUserEmail = sm.model.email;
      this.isLoggedIn = sm.isLoggedIn;
      this.role = sm.role;
    }

    this.testData = new Date().toString();
    this.testData2 = new Date().toString();
  }
  testData: string = '';
  testData2: string = '';


  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }


  linkName: string = '\\';
  getLinkName(linkName: string): void {
    this.linkName = `\\${linkName}`;
  }
   

/*
  rejestratorLogowania !: RejestratorLogowania;
  rejestratorLogowaniaId: string = '';
*/
  public login(form: FormGroup): void {

    // Pobranie wartości z kontrolek
    let email = form.controls['emailLogin'].value;
    let password = form.controls['passwordLogin'].value;


    // Przekazanie obiektu logowania do metody 
    let loginViewModel: LoginViewModel = {
      email: email,
      password: password,
      token: '',
      role: ''
    };

    this.logowanie = true;
    this.accountService.login(loginViewModel).subscribe({
      next: ((result: TaskResult<LoginViewModel>) => {

        if (result.success) {
           
          // czas po jakim użytkownik ma się wylogować w milisekundach, minuta to 60000 ms, 10 * 60 * 10 = 60000
          // let expirationTime = 10000; // 10 sek
          // let expirationTime = 60000; // 1 min
          let expirationTime = 600000; // 10 min
          let dataZalogowania = new Date();
          let dataAutomatycznegoWylogowania = dataZalogowania.setMilliseconds(expirationTime);

           
          // rejestrator logowania
/*
          this.rejestratorLogowaniaId = GuidGenerator.newGuid().toString();
          this.rejestratorLogowania.rejestratorLogowaniaId = this.rejestratorLogowaniaId;
          this.rejestratorLogowania.dataZalogowania = dataZalogowania.toString();
          this.rejestratorLogowania.dataWylogowania = '';
          this.rejestratorLogowania.userId = result.model.userId;
          this.rejestratorLogowaniaService.create(this.rejestratorLogowania);
*/

/*
          let rejestratorLogowaniaId = GuidGenerator.newGuid().toString();
          let rejestratorLogowania: RejestratorLogowania = {
            rejestratorLogowaniaId: rejestratorLogowaniaId,
            dataZalogowania: new Date().toString(),
            dataWylogowania: '',
            userId: result.model.userId
          };
          this.rejestratorLogowaniaService.create(rejestratorLogowania); 
*/

         
          // zapisanie w sesji zalogowanego użytkownika
          let sessionModel = {
            model: result.model as LoginViewModel,
            isLoggedIn: true,
            role: result.model.role,
            dataZalogowania: dataZalogowania,
            dataAutomatycznegoWylogowania: dataAutomatycznegoWylogowania,
            expirationTime: expirationTime,
            //rejestratorLogowaniaId: rejestratorLogowaniaId
          };             
          sessionStorage.setItem('sessionModel', JSON.stringify(sessionModel));


          this.zalogowanyUserEmail = result.model.email;
          this.isLoggedIn = true;
          this.logowanie = false;
          this.role = result.model.role ? result.model.role : "";


          
          form.reset();
          //this.router.navigate(['admin/users']);
          this.router.navigate(['admin/users']).then(() => location.reload());

          this.snackBarService.setSnackBar(`Zalogowany użytkownik: ${result.model.email}`);
        } else {
          this.snackBarService.setSnackBar(`${InfoService.info('Dashboard', 'login')}. ${result.message}.`);
          sessionStorage.removeItem('sessionModel');
          this.isLoggedIn = false;
          this.logowanie = false;
          form.reset();
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('Dashboard', 'login')}. Name: ${error.name}. Message: ${error.message}`);
        sessionStorage.removeItem('sessionModel');
        this.logowanie = false;
      }
    });
  }


  private setRejestratorLogowania(): void {

  }

  private setSessionAndData(): void {

  }


/*
  // Metoda odpowiedzialna za wylogowanie
  public wyloguj(): void {

    this.rejestratorLogowania.dataWylogowania = new Date().toString();
    this.rejestratorLogowaniaService.edit(this.rejestratorLogowaniaId, this.rejestratorLogowania);

    this.accountService.logout().subscribe({
      next: () => {
        // Wyczyszczenie danych z pamięci podręcznej
        sessionStorage.removeItem('sessionModel');
        //this.isLoggedIn = false;
        //this.router.navigate(['admin/users']);
        this.router.navigate(['admin']).then(() => location.reload());
      },
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('DashboardComponent', 'wyloguj')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }
*/


}
