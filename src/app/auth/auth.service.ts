import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromAppReducer from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable()
export class AuthService {
    
    error = new Subject<String>();
    tokenExpirationTimer: number;

    constructor(private httpClient: HttpClient,
                private router: Router,
                private store: Store<fromAppReducer.AppState>) {}
    
    setTokenExpiration(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }
    
    clearTokenExpiration(): void {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
