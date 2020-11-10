import { Component, OnInit } from '@angular/core';

import { Recipe } from '../../models/recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css', '../../app.component.css']
})
export class RecipeDetailComponent implements OnInit {
    id: number;
    selectedRecipe: Recipe;
    navigationErrorOccurred: boolean;

    constructor(private recipeService: RecipesService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
            this.selectedRecipe = this.recipeService.getRecipe(this.id);
        });
    }

    onAddToShoppingList() {
        this.recipeService.addIngredientsToShoppingList(this.selectedRecipe.ingredients);
    }

    onDeleteRecipe(): void {
        this.recipeService.deleteRecipe(this.id);
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
