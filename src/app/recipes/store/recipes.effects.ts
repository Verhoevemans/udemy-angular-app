import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Recipe } from '../../models/recipe.model';
import * as fromApp from '../../store/app.reducer';

import * as RecipesActions from './recipes.actions';

@Injectable()
export class RecipesEffects {
    
    @Effect()
    fetchRecipes = this.actions.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.httpClient.get<Recipe[]>(
                'https://udemy-app-4f3e7.firebaseio.com/recipes.json'
            );
        }),
        map((recipes) => {
            return recipes.map((recipe) => {
                return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
            });
        }),
        map((recipes) => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );
    
    @Effect({ dispatch: false })
    storeRecipes = this.actions.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([_actionData, recipesState]) => {
            return this.httpClient.put<Recipe[]>(
                'https://udemy-app-4f3e7.firebaseio.com/recipes.json',
                recipesState.recipes,
                { observe: 'body' }
            );
        })
    );
    
    constructor(private actions: Actions,
                private httpClient: HttpClient,
                private store: Store<fromApp.AppState>) {
    }
}
