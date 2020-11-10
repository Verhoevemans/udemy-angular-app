import * as ShoppingListActions from './shoppping-list.actions';
import { Ingredient } from '../../models/ingredient.model';

const initialState = {
    ingredients: [
        new Ingredient('apples', 5),
        new Ingredient('tomatoes', 10)
    ]
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShopppingListActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        default:
            return state;
    }
}
