import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '../../../models/recipe.model';
import { RecipesService } from '../../recipes.service';

@Component({
    selector: 'app-recipe-item',
    templateUrl: './recipe-item.component.html',
    styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
    @Input() recipe: Recipe;

    ngOnInit() {}
}
