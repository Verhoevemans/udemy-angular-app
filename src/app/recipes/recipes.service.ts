import { Recipe } from '../models/recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipesService {
    private recipes: Recipe[] = [
        new Recipe(
            'Chilli Con Carne',
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

    constructor(private shoppingListService: ShoppingListService) {}

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
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