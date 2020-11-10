import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private authService: AuthService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
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
