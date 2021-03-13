import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Recipe } from '../models/recipe.model';
import * as RecipesActions from '../recipes/store/recipes.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class RecipesResolver implements Resolve<Recipe[]> {
    
    constructor (private store: Store<fromApp.AppState>, private actions: Actions) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Recipe[] {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => {
                return recipesState.recipes;
            }),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    return this.actions
                        .pipe(
                            ofType(RecipesActions.SET_RECIPES),
                            take(1)
                        );
                } else {
                    return of(recipes);
                }
            })
        );
    }
    
}
