import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from '../recipes.service';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
    id: number;
    editMode = false;
    recipeForm: FormGroup;

    constructor(private route: ActivatedRoute,
                private recipesService: RecipesService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.editMode = params['id'] !== undefined;
            console.log(this.id);
            this.initForm();
        });
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
            this.recipesService.updateRecipe(this.id, this.recipeForm.value);
            this.router.navigate(['../'], {relativeTo: this.route});
        } else {
            this.recipesService.addRecipe(this.recipeForm.value);
            this.router.navigate(['recipes', this.recipesService.getRecipesListLength() - 1]);
        }
    }

    private initForm(): void {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray([]);

        if (this.editMode) {
            const recipe = this.recipesService.getRecipe(this.id);
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;
            for (let ingredient of recipe.ingredients) {
                recipeIngredients.push(
                    new FormGroup({
                        'name': new FormControl(ingredient.name, Validators.required),
                        'amount': new FormControl(ingredient.amount, [
                            Validators.required, Validators.pattern(/[1-9]+[0-9]*$/)
                        ])
                    })
                );
            }
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
