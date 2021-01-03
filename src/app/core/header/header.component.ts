import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Recipe } from '../../models/recipe.model';
import { User } from '../../models/user.model';
import { DataStorageService } from '../../shared/data-storage.service';
import * as AuthActions from '../../auth/store/auth.actions'
import * as fromAppReducer from '../../store/app.reducer';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    
    isAuthenticated = false;
    
    constructor(private dataStorageService: DataStorageService,
                private store: Store<fromAppReducer.AppState>) {
    }

    ngOnInit(): void {
        this.store.select('auth')
            .pipe(
                map((authState) => authState.user)
            ).subscribe((user: User) => {
                this.isAuthenticated = !!user;
            })
    }

    onFetchData(): void {
        this.dataStorageService.getRecipes().subscribe((recipes) => {
            console.log('recipes were retrieved:', recipes);
        });
    }

    onSaveData(): void {
        this.dataStorageService.storeRecipes().subscribe((response: Recipe[]) => {
            console.log('Save was successful:', response);
        });
    }

    onLogout(): void {
        this.store.dispatch(new AuthActions.Logout());
    }
    
}
