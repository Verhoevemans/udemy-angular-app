import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [
        SigninComponent,
        SignupComponent
    ],
    imports: [
        AuthRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class AuthModule {}
