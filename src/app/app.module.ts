import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AuthEffects } from './auth/store/auth.effects';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { appReducer } from './store/app.reducer';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AuthModule,
        BrowserModule,
        CoreModule,
        EffectsModule.forRoot([AuthEffects]),
        HttpClientModule,
        SharedModule,
        ShoppingListModule,
        StoreModule.forRoot(appReducer)
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
