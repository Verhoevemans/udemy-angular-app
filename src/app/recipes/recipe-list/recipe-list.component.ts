import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from '../../models/recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { promise } from 'selenium-webdriver';
import fulfilled = promise.fulfilled;

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css', '../../app.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
    recipes: Recipe[];
    subscription: Subscription;
    navigationErrorOccurred: boolean;

    constructor(private recipesService: RecipesService,
                private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.recipes = this.recipesService.getRecipes();
        this.subscription = this.recipesService.recipesChanged.subscribe((recipes: Recipe[]) => {
            this.recipes = recipes;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onNewRecipe(): void {
        this.router
            .navigate(['new'], {relativeTo: this.route})
            .then((fulfilled) => {
                console.log('navigate promise returned', fulfilled);
                this.navigationErrorOccurred = !fulfilled;
            });
    }
}
