import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import * as fromAppReducer from '../store/app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private store: Store<fromAppReducer.AppState>) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.store.select('auth').pipe(
            take(1),
            map((authState) => {
                return !!authState.user;
            })
        );
    }
}
