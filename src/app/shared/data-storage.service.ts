import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable()
export class DataStorageService {

    constructor(private httpClient: HttpClient,
                private recipesService: RecipesService,
                private authService: AuthService,
                private router: Router) {}

    getRecipes(): Observable<Recipe[]> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user: User) => {
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
        return this.authService.user.pipe(
            exhaustMap((user: User) => {
                return this.httpClient.put<Recipe[]>(
                    'https://udemy-app-4f3e7.firebaseio.com/recipes.json',
                    this.recipesService.getRecipes(),
                    { observe: 'body' }
                );
            })
        );
    }

}
