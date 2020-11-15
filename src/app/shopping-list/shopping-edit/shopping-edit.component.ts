import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    
    @ViewChild('shoppingForm', { static: true }) shoppingForm: NgForm;

    subscription: Subscription;
    editMode = false;
    selectedItem: Ingredient;
    selectedItemIndex: number;

    constructor(private shoppingListService: ShoppingListService,
                private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {}

    ngOnInit(): void {
        this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
            this.editMode = true;
            this.selectedItemIndex = index;
            this.selectedItem = this.shoppingListService.getIngredient(index);
            this.shoppingForm.setValue({
                name: this.selectedItem.name,
                amount: this.selectedItem.amount
            });
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onClear(): void {
        this.editMode = false;
        this.shoppingForm.reset();
    }

    onDelete(): void {
        this.shoppingListService.deleteIngredient(this.selectedItemIndex);
        this.onClear();
    }

    onSubmit(form: NgForm): void {
        const newIngredient = new Ingredient(form.value.name, form.value.amount);
        if (this.editMode) {
            this.shoppingListService.updateIngredient(this.selectedItemIndex, newIngredient);
        } else {
            this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
        }
        this.onClear();
    }
    
}
