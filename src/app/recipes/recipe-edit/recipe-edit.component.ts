import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import * as fromAppReducer from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    
    id: number;
    editMode = false;
    recipeForm: FormGroup;
    storeSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private store: Store<fromAppReducer.AppState>) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
            this.editMode = params['id'] !== undefined;
            this.initForm();
        });
    }
    
    ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    
    getControls(): AbstractControl[] {
        return (<FormArray> this.recipeForm.get('ingredients')).controls;
    }

    onAddIngredient(): void {
        (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
            'name': new FormControl(null, Validators.required),
            'amount': new FormControl(null, [Validators.required, Validators.pattern(/[1-9]+[0-9]*$/)])
        }));
    }

    onCancel(): void {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    onDeleteIngredient(index: number): void {
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    }

    onSubmit(): void {
        if (this.editMode) {
            this.store.dispatch(new RecipesActions.UpdateRecipe({ index: this.id, newRecipe: this.recipeForm.value }));
            this.router.navigate(['../'], {relativeTo: this.route});
        } else {
            this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
            this.store.select('recipes')
                .pipe(take(1))
                .subscribe((recipesState) => {
                    const index = recipesState.recipes.length === 0 ? 0 : recipesState.recipes.length - 1;
                    this.router.navigate(['recipes', index]);
                });
        }
    }

    private initForm(): void {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        const recipeIngredients = new FormArray([]);

        if (this.editMode) {
            this.storeSubscription = this.store.select('recipes')
                .pipe(
                    map((recipesState) => {
                        return recipesState.recipes.find((_recipe, index) => {
                            return index === this.id;
                        });
                    }))
                .subscribe((recipe) => {
                    recipeName = recipe.name;
                    recipeImagePath = recipe.imagePath;
                    recipeDescription = recipe.description;
                    for (const ingredient of recipe.ingredients) {
                        recipeIngredients.push(
                            new FormGroup({
                                'name': new FormControl(ingredient.name, Validators.required),
                                'amount': new FormControl(ingredient.amount, [
                                    Validators.required, Validators.pattern(/[1-9]+[0-9]*$/)
                                ])
                            })
                        );
                    }
                });
        } else {
            recipeIngredients.push(new FormGroup({
                'name': new FormControl(null, Validators.required),
                'amount': new FormControl(null, [Validators.required, Validators.pattern(/[1-9]+[0-9]*$/)])
            }));
        }

        this.recipeForm = new FormGroup({
            'name': new FormControl(recipeName, Validators.required),
            'imagePath': new FormControl(recipeImagePath, Validators.required),
            'description': new FormControl(recipeDescription, Validators.required),
            'ingredients': recipeIngredients
        });
    }
}
