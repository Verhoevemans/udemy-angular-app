import { Recipe } from '../../models/recipe.model';

import * as RecipesActions from './recipes.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function recipesReducer(state = initialState, action: RecipesActions.RecipesActions) {
    switch (action.type) {
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes.filter((_recipe, index) => index !== action.payload)]
            };
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipesActions.UPDATE_RECIPES:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe;
            
            return {
                ...state,
                recipes: updatedRecipes
            };
        default:
            return state;
    }
}
