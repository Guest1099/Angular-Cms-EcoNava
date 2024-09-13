import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccountHandlerService } from './account-handler.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  //private time = 10 * 60 * 1000; // odświeżanie zegara co 10 minut w milisekundach
  //private time = 10 * 60 * 100; // 1 min
  private time = 10 * 60 * 10; // 10s
  //private timerClock = 10000; // 10s
  //private timerClock = 60000; // 60s
  private timerClock = 600000; // 1h

  constructor(private accountService: AccountHandlerService) {
    // pobranie czasu zalogowania z sesji
    let sessionModel = sessionStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let dataWylogowania = sm.dataWylogowania;
        if (dataWylogowania) {
          setInterval(() => {
            // Jeżeli czas obecny jest większy od daty wylogowania wtedy następuje wylogowanie
            if (Date.now() >= dataWylogowania) {
              this.accountService.wyloguj();
              sessionStorage.setItem('sessionModel', JSON.stringify(sm));
            }
          }, this.timerClock);
        }
      }
    }
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Dodaj token JWT do nagłówka żądania, jeśli użytkownik jest zalogowany
    let sessionModel = sessionStorage.getItem('sessionModel');

    if (sessionModel) {
      let token = JSON.parse(sessionModel).model.token;
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request);
  }
}
