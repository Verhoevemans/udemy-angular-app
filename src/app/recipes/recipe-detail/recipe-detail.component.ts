import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../../models/recipe.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromAppReducer from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';


@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css', '../../app.component.css']
})
export class RecipeDetailComponent implements OnInit {
    
    id: number;
    selectedRecipe: Recipe;
    navigationErrorOccurred: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private store: Store<fromAppReducer.AppState>) {}

    ngOnInit() {
        this.route.params
            .pipe(
                map((params) => {
                    return +params['id'];
                }),
                switchMap((id) => {
                    this.id = id;
                    return this.store.select('recipes');
                }),
                map((recipesState) => {
                    return recipesState.recipes.find((_recipe, index) => {
                        return index === this.id;
                    });
                })
            )
            .subscribe((recipe) => {
                this.selectedRecipe = recipe;
            });
    }

    onAddToShoppingList() {
        this.store.dispatch(new ShoppingListActions.AddIngredients(this.selectedRecipe.ingredients));
    }

    onDeleteRecipe(): void {
        this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
        this.router.navigate(['recipes']);
    }

    onEditRecipe() {
        this.router
            .navigate(['edit'], {relativeTo: this.route})
            .then((fulfilled) => {
                this.navigationErrorOccurred = !fulfilled;
            });
    }
}
