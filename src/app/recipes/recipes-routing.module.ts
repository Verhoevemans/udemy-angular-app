import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolver } from './recipes.resolver';

const recipesRoutes: Routes = [
    { path: '', component: RecipesComponent, children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent, canActivate: [AuthGuard] },
            { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolver] },
            { path: ':id/edit', component: RecipeEditComponent, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(recipesRoutes) ],
    exports: [ RouterModule ]
})
export class RecipesRoutingModule {}
