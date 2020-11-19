import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducers';

@Injectable()
export class RecipesService {
    private recipes: Recipe[] = [
        new Recipe(
            'Chili Con Carne',
            'This recipe is only a test; don\'t actually cook this! But the description should not be too long.',
            'https://c1.staticflickr.com/3/2547/3862672238_30d378e7d6.jpg',
            [new Ingredient('Beans', 20), new Ingredient('Meat', 2)])
        , new Recipe(
            'Ice Cake',
            'This recipe is only a test; don\'t cook this!',
            'http://395b8fa9db24904bd7e1-a3c3d389bff73ed21ae62169b094651a.r26.cf2.rackcdn.com/i/pies/profile/hotfudgebrowniealamode_main1.jpg',
            [new Ingredient('Ice', 5), new Ingredient('Chocolate', 1)], )
    ];
    recipesChanged = new Subject<Recipe[]>();

    constructor(private store: Store<fromShoppingList.AppState>) {}

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipesListLength(): number {
        return this.recipes.length;
    }

    setRecipes(recipes: Recipe[]): void {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe): void {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }
}
