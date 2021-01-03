import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromAppReducer from '../store/app.reducer';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
    
    ingredients: Observable<{ ingredients: Ingredient[] }>;

    constructor(private store: Store<fromAppReducer.AppState>) {}

    ngOnInit(): void {
        this.ingredients = this.store.select('shoppingList');
    }

    onEditItem(index: number): void {
        this.store.dispatch(new ShoppingListActions.StartEdit(index));
    }
    
}
