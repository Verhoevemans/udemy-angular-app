import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../models/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducers';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    
    @ViewChild('shoppingForm', { static: true }) shoppingForm: NgForm;

    editMode = false;
    selectedItem: Ingredient;

    constructor(private store: Store<fromShoppingList.AppState>) {}

    ngOnInit(): void {
        this.store.select('shoppingList').subscribe((stateData) => {
            if (stateData.editedIngredientIndex > -1) {
                this.editMode = true;
                this.selectedItem = stateData.editedIngredient;
                this.shoppingForm.setValue({
                    name: this.selectedItem.name,
                    amount: this.selectedItem.amount
                });
            } else {
                this.editMode = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }

    onClear(): void {
        this.editMode = false;
        this.shoppingForm.reset();
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }

    onDelete(): void {
        this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.onClear();
    }

    onSubmit(form: NgForm): void {
        const newIngredient = new Ingredient(form.value.name, form.value.amount);
        if (this.editMode) {
            this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
        } else {
            this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
        }
        this.onClear();
    }
    
}
