import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AuthInterceptor } from '../auth/auth.interceptor';

import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';

@NgModule({
    declarations: [
        AlertComponent,
        DropdownDirective,
        LoadingSpinnerComponent,
        PlaceholderDirective
    ],
    exports: [
        AlertComponent,
        CommonModule,
        DropdownDirective,
        LoadingSpinnerComponent,
        PlaceholderDirective
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ]
})
export class SharedModule {}
