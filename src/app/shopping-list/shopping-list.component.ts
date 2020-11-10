import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient[];
    private subscription: Subscription;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit() {
        this.ingredients = this.shoppingListService.getIngredients();
        this.subscription = this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onEditItem(index: number): void {
        this.shoppingListService.startedEditing.next(index);
    }
}
