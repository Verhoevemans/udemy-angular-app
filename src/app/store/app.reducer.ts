import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducers';
import * as fromRecipes from '../recipes/store/recipes.reducer';

export interface AppState {
    auth: fromAuth.State;
    recipes: fromRecipes.State;
    shoppingList: fromShoppingList.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    recipes: fromRecipes.recipesReducer,
    auth: fromAuth.authReducer,
    shoppingList: fromShoppingList.shoppingListReducer
};
