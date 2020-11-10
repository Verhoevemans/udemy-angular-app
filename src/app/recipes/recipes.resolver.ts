import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Recipe } from '../models/recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipesService } from './recipes.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolver implements Resolve<Recipe[]> {
    
    constructor (private dataStorageService: DataStorageService, private recipesService: RecipesService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Recipe[] {
        const recipes = this.recipesService.getRecipes();
        
        if (recipes.length === 0 || !recipes[route.params.id]) {
            return this.dataStorageService.getRecipes();
        } else {
            return recipes;
        }
    }
    
}
