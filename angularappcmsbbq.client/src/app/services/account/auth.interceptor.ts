import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccountHandlerService } from './account-handler.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  //private time = 10 * 60 * 1000; // odświeżanie zegara co 10 minut w milisekundach
  //private time = 10 * 60 * 100; // 1 min
  //private time = 10 * 60 * 10; // 10s
  //private timerClock = 5000; // 5s
  //private timerClock = 10000; // 10s
  private timerClock = 20000; // 20s
  //private timerClock = 60000; // 60s
  //private timerClock = 600000; // 1h

  constructor(private accountService: AccountHandlerService) {
    // pobranie czasu zalogowania z sesji
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let dataWylogowania = sm.dataWylogowania;
        if (dataWylogowania) {

          let dateToMiliseconds = this.changeDateToMiliseconds(dataWylogowania);

          if (Date.now() >= dateToMiliseconds) {
            this.accountService.wyloguj();
          }


/*
          setInterval(() => {
            // Jeżeli czas obecny jest większy od daty wylogowania wtedy następuje wylogowanie
            if (Date.now() >= dateToMiliseconds) {
              this.accountService.wyloguj();
            }
          }, this.timerClock);
*/

        }
      }
    }
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Dodaj token JWT do nagłówka żądania, jeśli użytkownik jest zalogowany
    let sessionModel = localStorage.getItem('sessionModel');
      

    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {

/*
        let dataWylogowania = sm.dataWylogowania;
        if (dataWylogowania) {

          let dateToMiliseconds = this.changeDateToMiliseconds(dataWylogowania);

          if (Date.now() >= dateToMiliseconds) {
            this.accountService.wyloguj();
          }
        }
*/


        let token = sm.model.token;
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      }
    }

    return next.handle(request);
  }



  // Przekształca datę np. taką "12.12.2024 10:10:10" na milisekundy
  changeDateToMiliseconds(dateString: string): number {
    let [datePart, timePart] = dateString.split(' ');
    let [day, month, year] = datePart.split('.');
    let [hour, minute, second] = timePart.split(':');
    
    let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
    return date.getTime(); // data w milisekundach
  }


  tryLogout() {

  }


}
