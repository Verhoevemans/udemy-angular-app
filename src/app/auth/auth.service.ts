import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthService {
    error = new Subject<String>();
    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer: number;

    constructor(private httpClient: HttpClient, private router: Router) {}

    signupUser(email: string, password: string): Observable<AuthResponseData> {
        return this.httpClient
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(
                catchError(this.handleError),
                tap((responseData) => {
                    this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
                })
            );
    }

    /**
     * e: jeroen.verhoeven.eindhoven@gmail.com
     * p: jeroen
     **/
    signinUser(email: string, password: string): Observable<AuthResponseData> {
        return this.httpClient
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            ).pipe(
                catchError(this.handleError),
                tap((responseData) => {
                    this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
                })
            );
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
        return throwError(errorMessage);
    }
    
    handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const user = new User(
            email,
            userId,
            token,
            new Date(new Date().getTime() + expiresIn * 1000)
        );
        this.user.next(user);
        this.setTokenExpiration(expiresIn * 1000);
        localStorage.setItem('user-data', JSON.stringify(user));
    }
    
    getLocalStorageLogin(): void {
        const userData = JSON.parse(localStorage.getItem('user-data'));
        if (userData) {
            this.user.next(new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate)));
            this.setTokenExpiration(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
        }
    }
    
    setTokenExpiration(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    logout(): void {
        this.user.next(null);
        localStorage.removeItem('user-data');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
        this.router.navigate(['/']);
    }
}
