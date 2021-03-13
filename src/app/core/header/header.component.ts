import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as AuthActions from '../../auth/store/auth.actions';
import { User } from '../../models/user.model';
import * as RecipesActions from '../../recipes/store/recipes.actions';
import * as fromAppReducer from '../../store/app.reducer';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    
    isAuthenticated = false;
    
    constructor(private store: Store<fromAppReducer.AppState>) {
    }

    ngOnInit(): void {
        this.store.select('auth')
            .pipe(
                map((authState) => authState.user)
            ).subscribe((user: User) => {
                this.isAuthenticated = !!user;
            });
    }

    onFetchData(): void {
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onSaveData(): void {
        this.store.dispatch(new RecipesActions.StoreRecipes());
    }

    onLogout(): void {
        this.store.dispatch(new AuthActions.Logout());
    }
    
}
