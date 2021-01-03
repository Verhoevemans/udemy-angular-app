import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AuthService } from '../auth.service';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {
    
    /**
     * e: jeroen.verhoeven.eindhoven@gmail.com
     * p: jeroen
     **/
    @Effect()
    authLogin = this.actions.pipe(
        ofType(AuthActions.LOGIN_START),
        delay(2000),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.httpClient.post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true }
            ).pipe(
                map((responseData) => this.handleAuthentication(responseData)),
                catchError(this.handleError)
            );
        })
    );
    
    @Effect({ dispatch: false })
    authLogout = this.actions.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearTokenExpiration();
            localStorage.removeItem('user-data');
            this.router.navigate(['/signin']);
        })
    );
    
    @Effect()
    authSignup = this.actions.pipe(
        ofType(AuthActions.SIGNUP_START),
        delay(2000),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.httpClient.post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map((responseData) => this.handleAuthentication(responseData)),
                catchError(this.handleError)
            );
        })
    );
    
    @Effect({ dispatch: false })
    authRedirect = this.actions.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/recipes']);
        })
    );
    
    @Effect()
    autoLogin = this.actions.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData = JSON.parse(localStorage.getItem('user-data'));
            const user = userData
                ? new User(userData.email, userData.userId, userData._token, new Date(userData.expirationDate))
                : null;
            
            if (user && user.token) {
                this.authService.setTokenExpiration(user.expirationDate.getTime() - new Date().getTime());
                return new AuthActions.AuthenticateSuccess(user);
            } else {
                return { type: 'DUMMY' };
            }
        })
    );
    
    constructor(private actions: Actions,
                private authService: AuthService,
                private router: Router,
                private httpClient: HttpClient) {}
    
    handleAuthentication(responseData: AuthResponseData) {
        const user = new User(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            new Date(new Date().getTime() + +responseData.expiresIn * 1000)
        );
        localStorage.setItem('user-data', JSON.stringify(user));
        this.authService.setTokenExpiration(user.expirationDate.getTime() - new Date().getTime());
    
        return new AuthActions.AuthenticateSuccess(user);
    }
    
    handleError(errorResponse: HttpErrorResponse) {
        console.log(errorResponse);
        let errorMessage = 'An error occurred';
        if (errorResponse.error && errorResponse.error.error) {
            switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email already exists, please use another email address';
                    break;
                case 'WEAK_PASSWORD : Password should be at least 6 characters' :
                    errorMessage = 'The given password is too short, please use at least six characters';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'The given e-mail is not known. Please try again';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'The given password is incorrect. Please try again';
                    break;
                default:
                    errorMessage = errorResponse.error.error.message;
            }
        }
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    
}
