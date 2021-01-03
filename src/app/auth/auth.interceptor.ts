import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';

import { User } from '../models/user.model';
import * as fromAppReducer from '../store/app.reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private store: Store<fromAppReducer.AppState>) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(
            take(1),
            map((authState) => authState.user),
            exhaustMap((user: User) => {
                if (!user) {
                    return next.handle(req);
                } else {
                    const modifiedRequest = req.clone({ params: new HttpParams().set('auth', user ? user.token : null ) });
                    return next.handle(modifiedRequest);
                }
            })
        );
    }
    
}
