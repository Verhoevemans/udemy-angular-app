import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../recipes/recipes.service';
import * as fromAppReducer from '../store/app.reducer';

@Injectable()
export class DataStorageService {

    constructor(private httpClient: HttpClient,
                private recipesService: RecipesService,
                private store: Store<fromAppReducer.AppState>,
                private router: Router) {}

    getRecipes(): Observable<Recipe[]> {
        return this.store.select('auth').pipe(
            take(1),
            exhaustMap((_authState) => {
                return this.httpClient.get<Recipe[]>(
                    'https://udemy-app-4f3e7.firebaseio.com/recipes.json'
                );
            }),
            map((recipes) => {
                return recipes.map((recipe) => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                });
            }),
            tap((recipes) => {
                this.recipesService.setRecipes(recipes);
            }),
            catchError((error) => {
                this.router.navigate(['/']);
                return EMPTY;
            })
        );
    }

    storeRecipes(): Observable<Recipe[]> {
        return this.store.select('auth').pipe(
            exhaustMap((_authState) => {
                return this.httpClient.put<Recipe[]>(
                    'https://udemy-app-4f3e7.firebaseio.com/recipes.json',
                    this.recipesService.getRecipes(),
                    { observe: 'body' }
                );
            })
        );
    }

}
