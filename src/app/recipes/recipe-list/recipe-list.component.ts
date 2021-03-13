import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../../models/recipe.model';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css', '../../app.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
    
    recipes: Recipe[];
    subscription: Subscription;
    navigationErrorOccurred: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.subscription = this.store.select('recipes')
            .pipe(
                map((recipesState) => recipesState.recipes)
            ).subscribe((recipes: Recipe[]) => {
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
                this.navigationErrorOccurred = !fulfilled;
            });
    }
}
